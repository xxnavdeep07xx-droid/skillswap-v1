'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { mockLeaderboard } from '@/lib/mockData';
import { LEADERBOARD_PERIODS, LEAGUE_TIERS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function LeaderboardSection() {
  const { currentUser } = useAppStore();
  const [activePeriod, setActivePeriod] = useState<string>('Weekly');

  const top3 = mockLeaderboard.slice(0, 3);
  const rest = mockLeaderboard.slice(3);

  const getTierInfo = (tier: string) =>
    LEAGUE_TIERS.find((t) => t.name.toUpperCase() === tier.toUpperCase());

  return (
    <div className="max-w-md mx-auto">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-bold text-foreground flex-1">
            Leaderboard
          </h1>
          <Trophy size={20} className="text-amber-500" />
        </div>
        {/* Period tabs */}
        <div className="flex px-4 pb-3 gap-2">
          {LEADERBOARD_PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                activePeriod === period
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-6 pb-4">
        {/* ─── Podium ─── */}
        <div className="flex items-end justify-center gap-3 mb-8 h-[220px]">
          {/* 2nd place */}
          {top3[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-2">
                {top3[1].image ? (
                  <Image
                    src={top3[1].image}
                    alt={top3[1].name}
                    width={56}
                    height={56}
                    className="rounded-full border-3 border-slate-300 object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full border-3 border-slate-300 bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
                    {top3[1].name[0]}
                  </div>
                )}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-400 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  2
                </div>
              </div>
              <p className="text-xs font-semibold text-foreground mb-0.5 text-center max-w-[80px] truncate">
                {top3[1].name}
              </p>
              {getTierInfo(top3[1].leagueTier) && (
                <Badge
                  className={`${getTierInfo(top3[1].leagueTier)!.color} text-[9px] px-1.5 py-0 border-0 mb-2`}
                >
                  {top3[1].leagueTier}
                </Badge>
              )}
              <div className="w-20 rounded-t-xl bg-gradient-to-t from-slate-200 to-slate-100 flex flex-col items-center justify-end pt-3 pb-2 min-h-[80px]">
                <span className="text-lg font-bold text-slate-600">
                  {top3[1].points}
                </span>
                <span className="text-[9px] text-slate-400">points</span>
              </div>
            </motion.div>
          )}

          {/* 1st place */}
          {top3[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-2">
                <Crown
                  size={20}
                  className="text-amber-500 absolute -top-5 left-1/2 -translate-x-1/2"
                />
                {top3[0].image ? (
                  <Image
                    src={top3[0].image}
                    alt={top3[0].name}
                    width={64}
                    height={64}
                    className="rounded-full border-3 border-amber-400 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-3 border-amber-400 bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xl">
                    {top3[0].name[0]}
                  </div>
                )}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  1
                </div>
              </div>
              <p className="text-xs font-semibold text-foreground mb-0.5 text-center max-w-[80px] truncate">
                {top3[0].name}
              </p>
              {getTierInfo(top3[0].leagueTier) && (
                <Badge
                  className={`${getTierInfo(top3[0].leagueTier)!.color} text-[9px] px-1.5 py-0 border-0 mb-2`}
                >
                  {top3[0].leagueTier}
                </Badge>
              )}
              <div className="w-20 rounded-t-xl bg-gradient-to-t from-amber-300 to-amber-100 flex flex-col items-center justify-end pt-3 pb-2 min-h-[110px]">
                <span className="text-lg font-bold text-amber-700">
                  {top3[0].points}
                </span>
                <span className="text-[9px] text-amber-500">points</span>
              </div>
            </motion.div>
          )}

          {/* 3rd place */}
          {top3[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-2">
                {top3[2].image ? (
                  <Image
                    src={top3[2].image}
                    alt={top3[2].name}
                    width={56}
                    height={56}
                    className="rounded-full border-3 border-amber-700 object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full border-3 border-amber-700 bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-lg">
                    {top3[2].name[0]}
                  </div>
                )}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  3
                </div>
              </div>
              <p className="text-xs font-semibold text-foreground mb-0.5 text-center max-w-[80px] truncate">
                {top3[2].name}
              </p>
              {getTierInfo(top3[2].leagueTier) && (
                <Badge
                  className={`${getTierInfo(top3[2].leagueTier)!.color} text-[9px] px-1.5 py-0 border-0 mb-2`}
                >
                  {top3[2].leagueTier}
                </Badge>
              )}
              <div className="w-20 rounded-t-xl bg-gradient-to-t from-amber-200 to-amber-50 flex flex-col items-center justify-end pt-3 pb-2 min-h-[60px]">
                <span className="text-lg font-bold text-amber-800">
                  {top3[2].points}
                </span>
                <span className="text-[9px] text-amber-600">points</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* ─── Rankings List ─── */}
        <div className="space-y-2">
          {rest.map((entry, idx) => {
            const isCurrentUser = currentUser?.id === entry.userId;
            const rank = idx + 4;
            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (idx + 3) * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-2xl ${
                  isCurrentUser
                    ? 'bg-indigo-50 border-2 border-indigo-200'
                    : 'bg-white border border-slate-100'
                }`}
              >
                <span
                  className={`w-7 text-sm font-bold text-center ${
                    isCurrentUser ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  {rank}
                </span>
                <div className="relative shrink-0">
                  {entry.image ? (
                    <Image
                      src={entry.image}
                      alt={entry.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {entry.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isCurrentUser ? 'text-indigo-700' : 'text-foreground'
                      }`}
                    >
                      {entry.name}
                      {isCurrentUser && (
                        <span className="text-[10px] text-indigo-500 font-normal ml-1">
                          (You)
                        </span>
                      )}
                    </p>
                  </div>
                  {getTierInfo(entry.leagueTier) && (
                    <Badge
                      className={`${getTierInfo(entry.leagueTier)!.color} text-[9px] px-1.5 py-0 border-0 mt-0.5`}
                    >
                      {entry.leagueTier}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      isCurrentUser ? 'text-indigo-600' : 'text-foreground'
                    }`}
                  >
                    {entry.points}
                  </p>
                  <p className="text-[9px] text-slate-400">pts</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
