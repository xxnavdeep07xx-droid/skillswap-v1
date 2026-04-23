'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  getCoaches,
  mockSkillsTeach,
} from '@/lib/mockData';
import { SKILL_CATEGORIES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function CoachSection() {
  const {
    showFilters,
    setShowFilters,
    searchQuery,
    setSearchQuery,
    pushView,
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState('All');
  const [filterMinRating, setFilterMinRating] = useState(0);

  let coaches = getCoaches();

  // Filter by category
  if (activeCategory !== 'All') {
    coaches = coaches.filter((coach) => {
      const skills = mockSkillsTeach[coach.id] || [];
      return skills.some((s) => s.category === activeCategory);
    });
  }

  // Filter by search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    coaches = coaches.filter(
      (coach) =>
        coach.name.toLowerCase().includes(q) ||
        coach.username.toLowerCase().includes(q) ||
        (mockSkillsTeach[coach.id] || []).some((s) =>
          s.skillName.toLowerCase().includes(q),
        ),
    );
  }

  // Filter by rating
  if (filterMinRating > 0) {
    coaches = coaches.filter((coach) => coach.averageRating >= filterMinRating);
  }

  return (
    <div className="max-w-md mx-auto">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search coaches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-slate-100 border-0 text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className={`p-2 rounded-xl transition-colors ${
              filterMinRating > 0
                ? 'bg-indigo-100 text-indigo-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-3 -mx-4 pl-4">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Coach List ─── */}
      <div className="px-4 py-4 space-y-3">
        {coaches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No coaches found</p>
          </div>
        ) : (
          coaches.map((coach, idx) => {
            const skills = mockSkillsTeach[coach.id] || [];
            return (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
              >
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() =>
                    pushView('coach-profile', { coachId: coach.id })
                  }
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {coach.image ? (
                      <Image
                        src={coach.image}
                        alt={coach.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {coach.name[0]}
                      </div>
                    )}
                    {/* Online dot */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {coach.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0 shrink-0"
                      >
                        {coach.leagueTier}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      @{coach.username}
                    </p>
                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {skills.slice(0, 3).map((s) => (
                        <span
                          key={s.skillName}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-600"
                        >
                          {s.skillName}
                        </span>
                      ))}
                      {skills.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                          +{skills.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="text-amber-400 fill-amber-400"
                        />
                        {coach.averageRating}
                      </span>
                      <span>{coach.totalSessionsTaught} sessions</span>
                    </div>
                  </div>
                </div>

                {/* Book button */}
                <div className="mt-3 pt-3 border-t border-slate-50">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      pushView('booking', { coachId: coach.id });
                    }}
                    className="w-full h-9 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                  >
                    Book Session
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ─── Filter Sheet ─── */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle className="text-center">Filter Coaches</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-8 mt-4">
            <p className="text-sm font-medium text-foreground mb-3">
              Minimum Rating
            </p>
            <div className="flex gap-2 mb-6">
              {[0, 4, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterMinRating(rating)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterMinRating === rating
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {rating === 0 ? 'All' : `${rating}+ ⭐`}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => {
                setFilterMinRating(0);
                setShowFilters(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
