'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getCourseById, getUserById, mockEnrollments } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  Play,
  ChevronDown,
  ChevronUp,
  Lock,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';

interface CourseDetailPageProps {
  courseId: string;
}

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const { currentUser, popView } = useAppStore();
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const course = getCourseById(courseId);
  const coach = course ? getUserById(course.coachId) : undefined;

  if (!course || !coach) {
    return (
      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={popView} className="p-2 rounded-xl bg-slate-100">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold">Course not found</h1>
        </div>
      </div>
    );
  }

  const enrollment = mockEnrollments.find(
    (e) => e.courseId === courseId && e.userId === currentUser?.id,
  );
  const isEnrolled = !!enrollment;

  const handleEnroll = () => {
    if (course.isFree) {
      toast.success('Enrolled successfully! 🎉');
    } else if (course.spPrice && currentUser) {
      if (currentUser.sp >= course.spPrice) {
        toast.success(`Enrolled for ${course.spPrice} SP! 🎉`);
      } else {
        toast.error('Not enough SP to enroll');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Hero Thumbnail */}
      <div className="relative h-52">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button
          onClick={popView}
          className="absolute top-4 left-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <button className="absolute top-4 right-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
          <MessageCircle size={16} />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="mb-2 bg-white/20 text-white border-0 text-[10px]">
            {course.category}
          </Badge>
          <h1 className="text-lg font-bold text-white leading-tight">
            {course.title}
          </h1>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="flex items-center justify-around py-3 px-4">
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="font-semibold">{course.averageRating}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <Users size={14} />
            <span className="font-semibold">{course.totalEnrolled}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <Clock size={14} />
            <span className="font-semibold">{course.totalLessons} lessons</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Coach */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-slate-50 rounded-2xl">
          {coach.image ? (
            <Image
              src={coach.image}
              alt={coach.name}
              width={44}
              height={44}
              className="rounded-full"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {coach.name[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {coach.name}
            </p>
            <p className="text-xs text-slate-500">
              {coach.totalSessionsTaught} sessions ·{' '}
              {coach.averageRating.toFixed(1)} ⭐
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] shrink-0"
          >
            {coach.leagueTier}
          </Badge>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-foreground mb-2">
            About this course
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {course.description}
          </p>
        </div>

        <Separator className="mb-5" />

        {/* Lessons */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-foreground mb-3">
            Course Content
          </h2>
          <div className="space-y-2">
            {course.lessons.map((lesson, idx) => {
              const isExpanded = expandedLesson === lesson.id;
              return (
                <motion.div
                  key={lesson.id}
                  layout
                  className="border border-slate-100 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedLesson(isExpanded ? null : lesson.id)
                    }
                    className="w-full flex items-center gap-3 p-3 text-left"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        lesson.isFreePreview || isEnrolled
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isEnrolled && idx < Math.floor((enrollment!.progress / 100) * course.lessons.length) ? (
                        <CheckCircle2 size={16} />
                      ) : lesson.isFreePreview || isEnrolled ? (
                        <Play size={14} />
                      ) : (
                        <Lock size={14} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {lesson.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {lesson.duration} min
                        {lesson.isFreePreview && (
                          <span className="ml-1 text-indigo-500">
                            · Preview
                          </span>
                        )}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3 pb-3"
                    >
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {lesson.content}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="h-24" />
      </div>

      {/* Sticky enroll button */}
      <div className="fixed bottom-20 left-0 right-0 z-30 max-w-md mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-3">
          <div className="flex-1">
            {course.isFree ? (
              <div>
                <p className="text-xs text-slate-400">Price</p>
                <p className="text-lg font-bold text-emerald-600">Free</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-400">Price</p>
                <p className="text-lg font-bold text-foreground">
                  {course.spPrice} SP
                </p>
              </div>
            )}
          </div>
          <Button
            onClick={handleEnroll}
            disabled={isEnrolled}
            className={`h-12 px-8 font-semibold rounded-xl ${
              isEnrolled
                ? 'bg-slate-100 text-slate-500'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isEnrolled ? '✓ Enrolled' : course.isFree ? 'Enroll Free' : 'Enroll Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
