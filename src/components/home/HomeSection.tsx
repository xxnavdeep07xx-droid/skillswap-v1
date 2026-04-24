'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  mockCourses,
  mockEnrollments,
  getUserById,
  getNotificationsForUser,
} from '@/lib/mockData';
import { COURSE_FILTERS, DAILY_TASKS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Search,
  Bell,
  ListChecks,
  Star,
  Users,
  Clock,
  ChevronRight,
  X,
  Check,
  GraduationCap,
  BookOpen,
  Share2,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function HomeSection() {
  const {
    currentUser,
    courseFilter,
    setCourseFilter,
    showNotifications,
    setShowNotifications,
    showTasks,
    setShowTasks,
    searchQuery,
    setSearchQuery,
    pushView,
  } = useAppStore();

  const [taskCompleted, setTaskCompleted] = useState<Set<string>>(new Set(['login']));

  if (!currentUser) return null;

  // Continue learning data
  const enrollments = mockEnrollments.filter((e) => e.userId === currentUser.id);
  const continueLearning = enrollments.map((enrollment) => {
    const course = mockCourses.find((c) => c.id === enrollment.courseId);
    const coach = course ? getUserById(course.coachId) : undefined;
    return { enrollment, course, coach };
  }).filter((item) => item.course);

  // Filter courses
  const filteredCourses = mockCourses.filter((course) => {
    if (courseFilter === 'Free') return course.isFree;
    if (courseFilter === 'Paid') return !course.isFree;
    if (courseFilter === 'Trending') return course.isFeatured || course.totalEnrolled > 100;
    return true;
  });

  // Notifications
  const notifications = getNotificationsForUser(currentUser.id);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleTask = (taskId: string) => {
    setTaskCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const taskIconMap: Record<string, typeof GraduationCap> = {
    teach: GraduationCap,
    learn: BookOpen,
    review: Star,
    share: Share2,
    login: LogIn,
  };

  return (
    <div className="max-w-md mx-auto">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search courses, coaches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-slate-100 border-0 text-sm"
            />
          </div>
          <button
            onClick={() => setShowTasks(true)}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ListChecks size={18} className="text-slate-600" />
          </button>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Bell size={18} className="text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4">
        {/* ─── Greeting ─── */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-foreground">
            Hey {currentUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-500">
            {currentUser.streak > 0 && (
              <span className="inline-flex items-center gap-1">
                🔥 {currentUser.streak} day streak
              </span>
            )}
          </p>
        </div>

        {/* ─── Continue Learning ─── */}
        {continueLearning.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">
                Continue Learning
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
              {continueLearning.map(({ enrollment, course, coach }) => (
                <motion.div
                  key={course!.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pushView('course-detail', { courseId: course!.id })}
                  className="min-w-[260px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer"
                >
                  <div className="relative h-28">
                    <Image
                      src={course!.thumbnail}
                      alt={course!.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="text-xs text-white/80 font-medium line-clamp-1">
                        {course!.title}
                      </p>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] px-1.5">
                      {enrollment.progress}%
                    </Badge>
                  </div>
                  <div className="p-3">
                    <Progress
                      value={enrollment.progress}
                      className="h-1.5 mb-2"
                    />
                    <div className="flex items-center gap-2">
                      {coach?.image && (
                        <Image
                          src={coach.image}
                          alt={coach.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      )}
                      <span className="text-xs text-slate-500">
                        {coach?.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Featured Banner ─── */}
        <div className="mb-6">
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer"
            onClick={() =>
              pushView('course-detail', { courseId: 'course-1' })
            }
          >
            <Image
              src="/images/hero.png"
              alt="Featured"
              width={500}
              height={160}
              className="w-full h-36 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-indigo-600/40" />
            <div className="absolute inset-0 flex flex-col justify-center p-5">
              <Badge className="w-fit bg-white/20 text-white border-0 text-[10px] mb-2">
                <Sparkles size={10} /> Featured
              </Badge>
              <h3 className="text-white font-bold text-base leading-tight mb-1">
                Python for Beginners
              </h3>
              <p className="text-indigo-100 text-xs">Start coding today — Free!</p>
            </div>
          </div>
        </div>

        {/* ─── Learn Section ─── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">
              Explore Courses
            </h2>
            <button className="text-sm text-indigo-600 font-medium flex items-center gap-0.5">
              See all <ChevronRight size={14} />
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 -mx-4 px-4">
            {COURSE_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setCourseFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  courseFilter === filter
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredCourses.map((course) => {
              const coach = getUserById(course.coachId);
              return (
                <motion.div
                  key={course.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    pushView('course-detail', { courseId: course.id })
                  }
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    {!course.isFree && course.spPrice && (
                      <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] px-1.5">
                        {course.spPrice} SP
                      </Badge>
                    )}
                    {course.isFree && (
                      <Badge className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] px-1.5">
                        Free
                      </Badge>
                    )}
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight mb-1.5">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {coach?.image ? (
                        <Image
                          src={coach.image}
                          alt={coach.name}
                          width={16}
                          height={16}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] text-slate-400">
                          {coach?.name?.[0]}
                        </div>
                      )}
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        {coach?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        {course.averageRating}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Users size={10} />
                        {course.totalEnrolled}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Tasks Sheet ─── */}
      <Sheet open={showTasks} onOpenChange={setShowTasks}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle className="text-center">Daily Tasks</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-8 mt-2 space-y-3">
            {DAILY_TASKS.map((task) => {
              const Icon = taskIconMap[task.icon] || ListChecks;
              const done = taskCompleted.has(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    done
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      done
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {done ? <Check size={18} /> : <Icon size={18} />}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        done ? 'text-emerald-700 line-through' : 'text-foreground'
                      }`}
                    >
                      {task.label}
                    </p>
                  </div>
                  <Badge
                    className={`text-[10px] ${
                      done
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}
                  >
                    +{task.spReward} SP
                  </Badge>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* ─── Notifications Sheet ─── */}
      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent side="bottom" className="rounded-t-2xl max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle className="text-center">Notifications</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-8 mt-2 space-y-2">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">
                No notifications yet
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-xl border transition-all ${
                    notification.isRead
                      ? 'bg-white border-slate-100'
                      : 'bg-indigo-50 border-indigo-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        notification.isRead ? 'bg-transparent' : 'bg-indigo-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
