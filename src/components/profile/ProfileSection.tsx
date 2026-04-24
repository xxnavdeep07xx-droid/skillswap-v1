'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  mockSkillsTeach,
  mockSkillsLearn,
  getReviewsForUser,
  getUserById,
} from '@/lib/mockData';
import { LEAGUE_TIERS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Settings,
  Coins,
  Star,
  Award,
  GraduationCap,
  BookOpen,
  Edit3,
  Tag,
  Info,
  LogOut,
  ChevronRight,
  Flame,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';

export function ProfileSection() {
  const {
    currentUser,
    pushView,
    popView,
    showTasks,
    setShowTasks,
    logout,
  } = useAppStore();

  const viewStack = useAppStore((s) => s.viewStack);
  const topView = viewStack.length > 0 ? viewStack[viewStack.length - 1] : null;

  // If viewing settings sub-page
  if (topView?.type === 'settings') {
    return <SettingsPage />;
  }

  if (!currentUser) return null;

  const skillsTeach = mockSkillsTeach[currentUser.id] || [];
  const skillsLearn = mockSkillsLearn[currentUser.id] || [];
  const reviews = getReviewsForUser(currentUser.id);

  // Tier info
  const currentTierIdx = LEAGUE_TIERS.findIndex(
    (t) => t.name.toUpperCase() === currentUser.leagueTier.toUpperCase(),
  );
  const currentTierInfo = LEAGUE_TIERS[currentTierIdx] || LEAGUE_TIERS[0];
  const nextTierInfo = LEAGUE_TIERS[currentTierIdx + 1];
  const tierProgress = nextTierInfo
    ? ((currentUser.xp - currentTierInfo.xp) /
        (nextTierInfo.xp - currentTierInfo.xp)) *
      100
    : 100;

  return (
    <div className="max-w-md mx-auto">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <h1 className="text-lg font-bold text-foreground flex-1">
            Profile
          </h1>
          <button
            onClick={() => pushView('sp-wallet')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
          >
            <Coins size={16} className="text-amber-500" />
            <span className="text-sm font-bold">{currentUser.sp}</span>
            <span className="text-[10px] text-amber-500">SP</span>
          </button>
          <button
            onClick={() => pushView('settings')}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Settings size={18} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* ─── Profile Card ─── */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          {/* Cover */}
          <div className="relative h-28">
            <Image
              src={currentUser.coverImage || '/images/hero.png'}
              alt="Cover"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Avatar */}
          <div className="px-4 -mt-10 relative z-10">
            <div className="flex items-end gap-4">
              {currentUser.image ? (
                <Image
                  src={currentUser.image}
                  alt={currentUser.name}
                  width={72}
                  height={72}
                  className="rounded-2xl border-4 border-white shadow-md object-cover"
                />
              ) : (
                <div className="w-18 h-18 rounded-2xl border-4 border-white shadow-md bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                  {currentUser.name[0]}
                </div>
              )}
              <div className="pb-1">
                <h2 className="text-lg font-bold text-foreground">
                  {currentUser.name}
                </h2>
                <p className="text-sm text-slate-500">
                  @{currentUser.username}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 pt-3 pb-4">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                <Award size={12} className="mr-1" />
                {currentUser.role === 'COACH' ? 'Verified Coach' : 'Learner'}
              </Badge>
              <Badge
                className={`${currentTierInfo.color} text-xs border-0`}
              >
                {currentUser.leagueTier} Tier
              </Badge>
              {currentUser.streak > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs"
                >
                  <Flame size={12} className="mr-1 text-orange-500" />
                  {currentUser.streak} day streak
                </Badge>
              )}
            </div>

            {/* Bio */}
            {currentUser.bio && (
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentUser.bio}
              </p>
            )}
          </div>
        </motion.div>

        {/* ─── Stats Row ─── */}
        <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
          {[
            { label: 'Taught', value: currentUser.totalSessionsTaught, icon: GraduationCap },
            { label: 'Learned', value: currentUser.totalSessionsLearned, icon: BookOpen },
            { label: 'Rating', value: currentUser.averageRating > 0 ? currentUser.averageRating.toFixed(1) : '—', icon: Star },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-slate-100 p-3 text-center"
            >
              <stat.icon size={16} className="text-slate-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ─── League & Progress ─── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              League Progress
            </h3>
            <Badge
              className={`${currentTierInfo.color} text-[10px] border-0 px-2`}
            >
              {currentUser.leagueTier}
            </Badge>
          </div>
          <Progress
            value={Math.min(tierProgress, 100)}
            className="h-2.5 mb-2"
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {currentUser.xp} / {nextTierInfo?.xp ?? '∞'} XP
            </span>
            <span className="text-slate-400">
              Next: {nextTierInfo?.name ?? 'Max!'}
            </span>
          </div>
        </div>

        {/* ─── Skills ─── */}
        {skillsTeach.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-3">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Skills I Teach
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillsTeach.map((s) => (
                <span
                  key={s.skillName}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
                >
                  {s.skillName}
                </span>
              ))}
            </div>
          </div>
        )}

        {skillsLearn.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-3">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              I Want to Learn
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillsLearn.map((s) => (
                <span
                  key={s.skillName}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700"
                >
                  {s.skillName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ─── Reviews ─── */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Recent Reviews
            </h3>
            <div className="space-y-3">
              {reviews.slice(0, 3).map((review) => {
                const reviewer = getUserById(review.reviewerId);
                return (
                  <div key={review.id} className="flex gap-2.5">
                    <div className="shrink-0">
                      {reviewer?.image ? (
                        <Image
                          src={reviewer.image}
                          alt={reviewer.name}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                          {reviewer?.name?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-xs font-medium text-foreground">
                          {reviewer?.name}
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={
                                i < review.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Settings Sub-Page ───
function SettingsPage() {
  const { popView, logout } = useAppStore();

  const settingsItems = [
    {
      icon: Edit3,
      label: 'Edit Profile',
      description: 'Update your name, bio, and photo',
      onClick: () => {
        toast.info('Edit Profile coming soon!');
      },
    },
    {
      icon: Tag,
      label: 'Manage Skills',
      description: 'Add or remove your teaching & learning skills',
      onClick: () => {
        toast.info('Manage Skills coming soon!');
      },
    },
    {
      icon: Info,
      label: 'About SkillSwap',
      description: 'Version 1.0.0 · Made with ♥',
      onClick: () => {
        toast.info('SkillSwap v1.0.0');
      },
    },
    {
      icon: LogOut,
      label: 'Log Out',
      description: 'Sign out of your account',
      onClick: () => {
        logout();
        toast.success('Logged out successfully');
      },
      danger: true,
    },
  ];

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
          <h1 className="text-lg font-bold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-2">
        {settingsItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 transition-colors text-left"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                'danger' in item && item.danger
                  ? 'bg-red-50 text-red-500'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <item.icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold ${
                  'danger' in item && item.danger
                    ? 'text-red-600'
                    : 'text-foreground'
                }`}
              >
                {item.label}
              </p>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
