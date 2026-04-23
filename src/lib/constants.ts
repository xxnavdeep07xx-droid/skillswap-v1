// Skill Categories
export const SKILL_CATEGORIES = [
  "Design",
  "Coding",
  "Music",
  "Art",
  "Languages",
  "Photography",
  "Video Editing",
  "Gaming",
  "Fitness",
  "Others",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

// League Tiers
export const LEAGUE_TIERS = [
  { name: "Starter", xp: 0, color: "bg-slate-200 text-slate-600", dotColor: "bg-slate-400" },
  { name: "Learner", xp: 200, color: "bg-blue-100 text-blue-600", dotColor: "bg-blue-400" },
  { name: "Skilled", xp: 800, color: "bg-emerald-100 text-emerald-600", dotColor: "bg-emerald-400" },
  { name: "Pro", xp: 2000, color: "bg-purple-100 text-purple-600", dotColor: "bg-purple-400" },
  { name: "Expert", xp: 5000, color: "bg-amber-100 text-amber-700", dotColor: "bg-amber-400" },
  { name: "Master", xp: 10000, color: "bg-cyan-100 text-cyan-600", dotColor: "bg-cyan-400" },
] as const;

export const TIER_PRIVILEGES: Record<string, string[]> = {
  Starter: ["Book sessions", "Chat with coaches", "Browse courses"],
  Learner: ["Upload showcase videos", "Create free courses", "Everything in Starter"],
  Skilled: ["Set custom SP prices", "Priority in search", "Everything in Learner"],
  Pro: ["Create premium courses", "Featured badge", "Everything in Skilled"],
  Expert: ["Expert verified badge", "Everything in Pro"],
  Master: ["Profile spotlight on Home", "Everything in Expert"],
};

// Daily Tasks
export const DAILY_TASKS = [
  { id: "teach", label: "Teach a session", spReward: 15, icon: "GraduationCap" },
  { id: "learn", label: "Learn something", spReward: 10, icon: "BookOpen" },
  { id: "review", label: "Write a review", spReward: 5, icon: "Star" },
  { id: "share", label: "Share your profile", spReward: 3, icon: "Share2" },
  { id: "login", label: "Log in daily", spReward: 2, icon: "LogIn" },
] as const;

// Suggested Skills for Onboarding
export const SUGGESTED_SKILLS_TEACH = [
  "Design",
  "Coding",
  "Guitar",
  "Photography",
  "Video Editing",
  "Fitness",
  "Languages",
  "Art",
  "Music Production",
  "Yoga",
];

export const SUGGESTED_SKILLS_LEARN = [
  "Python",
  "Spanish",
  "Guitar",
  "Photography",
  "Photoshop",
  "Video Editing",
  "Fitness",
  "UI/UX Design",
  "Data Science",
  "Cooking",
];

// XP Earning Rates
export const XP_RATES = {
  SESSION_COMPLETE: 10,
  WRITE_REVIEW: 5,
  DAILY_STREAK: 3,
  CREATE_FEATURED_COURSE: 20,
  MONTHLY_LEADERBOARD_TOP10: 50,
  REFER_FRIEND: 30,
} as const;

// Streak Milestones
export const STREAK_MILESTONES = [
  { days: 7, bonus: 20 },
  { days: 14, bonus: 30 },
  { days: 30, bonus: 50 },
] as const;

// Session cancel rules
export const CANCEL_RULES = {
  FULL_REFUND_HOURS: 6,
  PARTIAL_REFUND_PERCENT: 50,
} as const;

// Default SP values
export const SP_VALUES = {
  WELCOME_BONUS: 50,
  MIN_SESSION_COST: 10,
  MAX_SESSION_COST: 50,
  MIN_COURSE_COST: 50,
  MAX_COURSE_COST: 500,
  COMPLETE_PROFILE_BONUS: 10,
  FIRST_SESSION_BONUS: 10,
  WRITE_REVIEW_BONUS: 5,
  REFER_FRIEND_BONUS: 20,
} as const;

// Report Reasons
export const REPORT_REASONS = [
  "Inappropriate behavior",
  "No-show",
  "Fake profile",
  "Harassment",
  "Spam",
  "Other",
] as const;

// Notification Types
export const NOTIFICATION_TYPES = [
  "SESSION_REQUEST",
  "SESSION_CONFIRMED",
  "SESSION_REMINDER",
  "NEW_MESSAGE",
  "REVIEW_RECEIVED",
  "LEAGUE_UP",
  "SP_EARNED",
  "COACH_ELIGIBLE",
  "NEW_FOLLOWER",
  "SYSTEM",
] as const;

// Course filter options
export const COURSE_FILTERS = ["All", "Free", "Paid", "Trending"] as const;

// Leaderboard periods
export const LEADERBOARD_PERIODS = ["Weekly", "Monthly", "All Time"] as const;
