'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getConversationById } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Phone,
  Video,
  Send,
  Paperclip,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';

interface ChatRoomProps {
  conversationId: string;
  userId: string;
  userName: string;
  userImage: string | null;
}

export function ChatRoom({
  conversationId,
  userId,
  userName,
  userImage,
}: ChatRoomProps) {
  const { currentUser, popView } = useAppStore();
  const [messageText, setMessageText] = useState('');
  const [localMessages, setLocalMessages] = useState<
    { id: string; senderId: string; content: string; createdAt: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = getConversationById(conversationId);

  const allMessages = [
    ...(conversation?.messages || []).map((m) => ({
      id: m.id,
      senderId: m.senderId,
      content: m.content,
      createdAt: m.createdAt,
    })),
    ...localMessages,
  ].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages.length]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newMsg = {
      id: `local-${Date.now()}`,
      senderId: currentUser?.id || '',
      content: messageText.trim(),
      createdAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setMessageText('');

    // Simulate a reply after a short delay
    setTimeout(() => {
      const reply = {
        id: `reply-${Date.now()}`,
        senderId: userId,
        content: 'Thanks for your message! I\'ll get back to you soon. 😊',
        createdAt: new Date().toISOString(),
      };
      setLocalMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const groupedMessages: {
    date: string;
    messages: (typeof allMessages)[number][];
  }[] = [];
  let lastDate = '';
  for (const msg of allMessages) {
    const msgDate = new Date(msg.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    if (msgDate !== lastDate) {
      groupedMessages.push({ date: msgDate, messages: [msg] });
      lastDate = msgDate;
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto">
      {/* ─── Top Bar ─── */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 px-3 py-2.5 flex items-center gap-3">
        <button
          onClick={popView}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            {userName[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {userName}
          </p>
          <p className="text-[10px] text-emerald-500">Online</p>
        </div>
        <button
          onClick={() => toast.info('Voice calls coming soon!')}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <Phone size={18} className="text-slate-500" />
        </button>
        <button
          onClick={() => toast.info('Video calls coming soon!')}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <Video size={18} className="text-slate-500" />
        </button>
      </div>

      {/* ─── Messages Area ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-slate-50/50">
        {groupedMessages.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex items-center justify-center mb-3">
              <span className="text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {group.date}
              </span>
            </div>
            {/* Messages */}
            <div className="space-y-2">
              {group.messages.map((msg) => {
                const isMine = msg.senderId === currentUser?.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-3.5 py-2 rounded-2xl ${
                        isMine
                          ? 'bg-indigo-600 text-white rounded-br-md'
                          : 'bg-white text-foreground border border-slate-100 rounded-bl-md shadow-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p
                        className={`text-[9px] mt-1 ${
                          isMine
                            ? 'text-indigo-200'
                            : 'text-slate-400'
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input Bar ─── */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 px-3 py-2.5 flex items-center gap-2">
        <button
          onClick={() => toast.info('Attachments coming soon!')}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <Paperclip size={18} className="text-slate-400" />
        </button>
        <Input
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-10 rounded-full bg-slate-100 border-0 text-sm px-4"
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 shrink-0"
        >
          <Send size={16} className="text-white" />
        </Button>
      </div>
    </div>
  );
}
