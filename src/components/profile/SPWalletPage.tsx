'use client';

import { useAppStore } from '@/store/useAppStore';
import { getTransactionsForUser } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Coins,
  TrendingUp,
  TrendingDown,
  GraduationCap,
  BookOpen,
  Star,
  Share2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function SPWalletPage() {
  const { currentUser, popView } = useAppStore();

  const transactions = currentUser
    ? getTransactionsForUser(currentUser.id)
    : [];

  const totalEarned = transactions
    .filter((t) => t.type === 'EARNED')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = transactions
    .filter((t) => t.type === 'SPENT')
    .reduce((sum, t) => sum + t.amount, 0);

  const earnWays = [
    { icon: GraduationCap, label: 'Teach a session', amount: '+15 SP' },
    { icon: BookOpen, label: 'Learn something', amount: '+10 SP' },
    { icon: Star, label: 'Write a review', amount: '+5 SP' },
    { icon: Share2, label: 'Share profile', amount: '+3 SP' },
  ];

  if (!currentUser) return null;

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={popView}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <h1 className="text-lg font-bold text-foreground flex-1">
            SP Wallet
          </h1>
        </div>
      </div>

      <div className="px-4 pt-6 pb-4">
        {/* ─── Balance Card ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-6 text-white mb-6"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Coins size={20} className="text-white/80" />
              <span className="text-sm text-white/80 font-medium">
                Skill Points Balance
              </span>
            </div>
            <p className="text-4xl font-extrabold mb-4">
              {currentUser.sp}{' '}
              <span className="text-lg font-medium text-white/70">SP</span>
            </p>
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-white/60">Earned</p>
                <p className="text-sm font-bold text-white flex items-center gap-1">
                  <TrendingUp size={12} /> {totalEarned} SP
                </p>
              </div>
              <div>
                <p className="text-xs text-white/60">Spent</p>
                <p className="text-sm font-bold text-white flex items-center gap-1">
                  <TrendingDown size={12} /> {totalSpent} SP
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Earn SP ─── */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-foreground mb-3">
            Earn SP
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {earnWays.map((way) => (
              <div
                key={way.label}
                className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-100"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <way.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground line-clamp-1">
                    {way.label}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold">
                    {way.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Transaction History ─── */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Transaction History
          </h2>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx, idx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'EARNED'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-red-100 text-red-500'
                    }`}
                  >
                    {tx.type === 'EARNED' ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {tx.reason}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      tx.type === 'EARNED'
                        ? 'text-emerald-600'
                        : 'text-red-500'
                    }`}
                  >
                    {tx.type === 'EARNED' ? '+' : '-'}{tx.amount} SP
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
