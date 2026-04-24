'use client';

import { useAppStore } from '@/store/useAppStore';
import { mockConversations, getUserById } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Search, Plus, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function ChatSection() {
  const { currentUser, pushView } = useAppStore();

  if (!currentUser) return null;

  // Get conversations for current user
  const myConversations = mockConversations.filter((conv) =>
    conv.participants.includes(currentUser.id),
  );

  return (
    <div className="max-w-md mx-auto">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-bold text-foreground flex-1">
            Messages
          </h1>
          <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
            <Plus size={18} />
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search conversations..."
              className="pl-9 h-9 rounded-xl bg-slate-100 border-0 text-sm"
            />
          </div>
        </div>
      </div>

      {/* ─── Conversation List ─── */}
      <div className="px-4 py-2">
        {myConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              No conversations yet
            </p>
            <p className="text-xs text-slate-400">
              Start chatting with coaches and learners
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {myConversations.map((conv, idx) => {
              const otherUserId = conv.participants.find(
                (id) => id !== currentUser.id,
              );
              const otherUser = otherUserId
                ? getUserById(otherUserId)
                : undefined;
              const lastMessage =
                conv.messages[conv.messages.length - 1];
              const isMyMessage = lastMessage?.senderId === currentUser.id;

              // Check for unread (mock: last message not from me)
              const hasUnread = !isMyMessage && idx === 0;

              return (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() =>
                    pushView('chat-room', {
                      conversationId: conv.id,
                      userId: otherUserId,
                      userName: otherUser?.name || 'Unknown',
                      userImage: otherUser?.image || null,
                    })
                  }
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {otherUser?.image ? (
                      <Image
                        src={otherUser.image}
                        alt={otherUser.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {otherUser?.name?.[0] || '?'}
                      </div>
                    )}
                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {otherUser?.name || 'Unknown'}
                      </h3>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                        {lastMessage
                          ? new Date(
                              lastMessage.createdAt,
                            ).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })
                          : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 line-clamp-1 pr-2">
                        {isMyMessage ? 'You: ' : ''}
                        {lastMessage?.content || 'No messages'}
                      </p>
                      {hasUnread && (
                        <span className="w-5 h-5 bg-indigo-600 rounded-full text-[10px] text-white font-bold flex items-center justify-center shrink-0">
                          2
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
