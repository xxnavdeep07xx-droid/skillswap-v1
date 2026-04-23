'use client';

import { useAppStore, type TabId } from '@/store/useAppStore';
import {
  Home,
  GraduationCap,
  MessageCircle,
  Trophy,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'coach', label: 'Coach', icon: GraduationCap },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'board', label: 'Board', icon: Trophy },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
      aria-label="Main navigation"
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-slate-200 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-bottom">
        <div className="flex items-center justify-around px-2 pt-2 pb-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors"
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-indigo-50 rounded-xl"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <Icon
                    size={22}
                    className={`relative z-10 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                    fill={isActive ? 'currentColor' : 'none'}
                    strokeWidth={isActive ? 0 : 1.5}
                  />
                  {/* Unread badge on Chat */}
                  {tab.id === 'chat' && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <span
                  className={`relative z-10 text-[10px] font-medium transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
