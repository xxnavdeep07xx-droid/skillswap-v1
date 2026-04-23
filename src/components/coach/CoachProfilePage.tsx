'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  getUserById,
  mockSkillsTeach,
  mockSkillsLearn,
  getReviewsForUser,
} from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Star,
  Award,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CoachProfilePageProps {
  coachId: string;
}

export function CoachProfilePage({ coachId }: CoachProfilePageProps) {
  const { popView, pushView } = useAppStore();

  const coach = getUserById(coachId);
  const skillsTeach = mockSkillsTeach[coachId] || [];
  const skillsLearn = mockSkillsLearn[coachId] || [];
  const reviews = getReviewsForUser(coachId);

  if (!coach) {
    return (
      <div className="max-w-md mx-auto px-4 pt-4">
        <button onClick={popView} className="p-2 rounded-xl bg-slate-100 mb-4">
          <ArrowLeft size={18} />
        </button>
        <p className="text-slate-400 text-center py-8">Coach not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Cover + Back */}
      <div className="relative h-40">
        <Image
          src={coach.coverImage || '/images/hero.png'}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          onClick={popView}
          className="absolute top-4 left-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Avatar overlapping */}
      <div className="px-4 -mt-12 relative z-10">
        <div className="flex items-end gap-4">
          <div className="relative">
            {coach.image ? (
              <Image
                src={coach.image}
                alt={coach.name}
                width={80}
                height={80}
                className="rounded-2xl border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                {coach.name[0]}
              </div>
            )}
          </div>
          <div className="pb-1 flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">
              {coach.name}
            </h1>
            <p className="text-sm text-slate-500">@{coach.username}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4">
        {/* Role badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge
            variant="secondary"
            className="text-xs"
          >
            <Award size={12} className="mr-1" />
            {coach.role === 'COACH' ? 'Verified Coach' : 'Learner'}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs"
          >
            {coach.leagueTier} Tier
          </Badge>
        </div>

        {/* Bio */}
        {coach.bio && (
          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            {coach.bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Sessions Taught', value: coach.totalSessionsTaught, icon: GraduationCap },
            { label: 'Sessions Learned', value: coach.totalSessionsLearned, icon: BookOpen },
            { label: 'Rating', value: coach.averageRating > 0 ? coach.averageRating.toFixed(1) : '—', icon: Star },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-50 rounded-xl p-3 text-center"
            >
              <stat.icon size={16} className="text-slate-400 mx-auto mb-1" />
              <p className="text-base font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Skills I Teach */}
        {skillsTeach.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-foreground mb-2">
              Skills I Teach
            </h2>
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

        {/* Skills I Want to Learn */}
        {skillsLearn.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-foreground mb-2">
              Skills I Want to Learn
            </h2>
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

        <Separator className="my-4" />

        {/* Reviews */}
        <div className="mb-24">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-400">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => {
                const reviewer = getUserById(review.reviewerId);
                return (
                  <div
                    key={review.id}
                    className="bg-slate-50 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
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
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {reviewer?.name}
                        </p>
                        <div className="flex items-center gap-0.5">
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
                      <span className="text-[10px] text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Book CTA */}
      <div className="fixed bottom-20 left-0 right-0 z-30 max-w-md mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border border-slate-100">
          <Button
            onClick={() => pushView('booking', { coachId })}
            className="w-full h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
          >
            Book a Session
          </Button>
        </div>
      </div>
    </div>
  );
}
