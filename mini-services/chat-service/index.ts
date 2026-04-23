import { Server } from "socket.io";

const PORT = 3004;

const io = new Server(PORT, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
  },
});

// In-memory stores
const onlineUsers = new Map<string, string>(); // userId -> socketId
const userSockets = new Map<string, string>(); // socketId -> userId

console.log(`💬 SkillSwap Chat Service running on port ${PORT}`);

io.on("connection", (socket) => {
  console.log(`🔗 User connected: ${socket.id}`);

  // Authenticate and register user
  socket.on("register", (userId: string) => {
    userSockets.set(socket.id, userId);
    onlineUsers.set(userId, socket.id);
    console.log(`👤 User registered: ${userId} (socket: ${socket.id})`);
    
    // Notify user's contacts they're online
    socket.broadcast.emit("user-online", { userId });
  });

  // Join a conversation room
  socket.on("join-conversation", (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`💬 User ${socket.id} joined conversation: ${conversationId}`);
  });

  // Leave a conversation room
  socket.on("leave-conversation", (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // Send a message to a conversation
  socket.on("send-message", (data: {
    conversationId: string;
    message: {
      id: string;
      conversationId: string;
      senderId: string;
      content: string;
      messageType: string;
      createdAt: string;
    };
  }) => {
    const { conversationId, message } = data;
    
    // Broadcast to all users in the conversation room
    socket.to(`conversation:${conversationId}`).emit("new-message", {
      conversationId,
      message,
    });

    console.log(`📨 Message in ${conversationId} from ${message.senderId}`);
  });

  // Typing indicator
  socket.on("typing", (data: { conversationId: string; userId: string }) => {
    socket.to(`conversation:${data.conversationId}`).emit("user-typing", {
      conversationId: data.conversationId,
      userId: data.userId,
    });
  });

  // Stop typing indicator
  socket.on("stop-typing", (data: { conversationId: string; userId: string }) => {
    socket.to(`conversation:${data.conversationId}`).emit("user-stop-typing", {
      conversationId: data.conversationId,
      userId: data.userId,
    });
  });

  // Mark messages as read
  socket.on("mark-read", (data: { conversationId: string; userId: string }) => {
    socket.to(`conversation:${data.conversationId}`).emit("messages-read", {
      conversationId: data.conversationId,
      userId: data.userId,
    });
  });

  // Notification
  socket.on("notify", (data: { userId: string; notification: Record<string, unknown> }) => {
    const targetSocketId = onlineUsers.get(data.userId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("notification", data.notification);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    const userId = userSockets.get(socket.id);
    if (userId) {
      onlineUsers.delete(userId);
      userSockets.delete(socket.id);
      console.log(`👋 User disconnected: ${userId} (${socket.id})`);
      
      // Notify contacts user is offline
      socket.broadcast.emit("user-offline", { userId });
    }
  });
});

// Health check
io.on("error", (err) => {
  console.error("❌ Socket.io error:", err);
});

console.log(`✅ Chat service ready on port ${PORT}`);
