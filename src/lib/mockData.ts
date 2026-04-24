import type { User } from "@/store/useAppStore";

// ─── Users ──────────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: "demo-user-1",
    name: "Priya Sharma",
    username: "priyasharma",
    email: "priya@example.com",
    image: "/images/avatar-coach-1.jpg",
    coverImage: "/images/hero.png",
    bio: "Full-stack developer & coding tutor. 5 years of experience. Love teaching Python, React, and system design! 🚀",
    role: "COACH",
    leagueTier: "PRO",
    xp: 2500,
    sp: 320,
    streak: 12,
    lastActiveAt: new Date().toISOString(),
    totalSessionsTaught: 47,
    totalSessionsLearned: 15,
    averageRating: 4.8,
    onboardingCompleted: true,
  },
  {
    id: "demo-user-2",
    name: "Rahul Verma",
    username: "rahulverma",
    email: "rahul@example.com",
    image: "/images/avatar-coach-2.jpg",
    coverImage: "/images/hero.png",
    bio: "Musician & guitar teacher. Playing for 10 years, teaching for 5. From classical to rock, I can teach it all! 🎸",
    role: "COACH",
    leagueTier: "SKILLED",
    xp: 1200,
    sp: 180,
    streak: 5,
    lastActiveAt: new Date().toISOString(),
    totalSessionsTaught: 32,
    totalSessionsLearned: 8,
    averageRating: 4.6,
    onboardingCompleted: true,
  },
  {
    id: "demo-user-3",
    name: "Ananya Patel",
    username: "ananyapatel",
    email: "ananya@example.com",
    image: "/images/avatar-coach-3.jpg",
    coverImage: "/images/hero.png",
    bio: "Photographer & visual storyteller. Specializing in portrait and street photography. Let me help you see the world through a lens! 📸",
    role: "COACH",
    leagueTier: "LEARNER",
    xp: 450,
    sp: 95,
    streak: 3,
    lastActiveAt: new Date().toISOString(),
    totalSessionsTaught: 18,
    totalSessionsLearned: 12,
    averageRating: 4.9,
    onboardingCompleted: true,
  },
  {
    id: "demo-user-4",
    name: "Arjun Kumar",
    username: "arjunkumar",
    email: "arjun@example.com",
    image: "/images/avatar-coach-4.jpg",
    coverImage: "/images/hero.png",
    bio: "Certified fitness trainer. Transforming lives through science-backed workout programs. Let's get stronger together! 💪",
    role: "COACH",
    leagueTier: "EXPERT",
    xp: 6200,
    sp: 450,
    streak: 21,
    lastActiveAt: new Date().toISOString(),
    totalSessionsTaught: 89,
    totalSessionsLearned: 5,
    averageRating: 4.7,
    onboardingCompleted: true,
  },
  {
    id: "demo-user-5",
    name: "Sneha Reddy",
    username: "snehareddy",
    email: "sneha@example.com",
    image: null,
    coverImage: null,
    bio: "UI/UX designer passionate about creating beautiful user experiences. Currently learning video editing! 🎨",
    role: "STUDENT",
    leagueTier: "LEARNER",
    xp: 350,
    sp: 65,
    streak: 7,
    lastActiveAt: new Date().toISOString(),
    totalSessionsTaught: 2,
    totalSessionsLearned: 14,
    averageRating: 0,
    onboardingCompleted: true,
  },
  {
    id: "demo-user-6",
    name: "Vikram Singh",
    username: "vikramsingh",
    email: "vikram@example.com",
    image: null,
    coverImage: null,
    bio: "College student learning guitar and photography. Love the SkillSwap community! 🎸📸",
    role: "STUDENT",
    leagueTier: "STARTER",
    xp: 80,
    sp: 42,
    streak: 2,
    lastActiveAt: new Date().toISOString(),
    totalSessionsTaught: 0,
    totalSessionsLearned: 3,
    averageRating: 0,
    onboardingCompleted: true,
  },
];

// ─── Skills ─────────────────────────────────────────────────────────────────
export const mockSkillsTeach: Record<string, { skillName: string; category: string }[]> = {
  "demo-user-1": [
    { skillName: "Python", category: "Coding" },
    { skillName: "React", category: "Coding" },
    { skillName: "JavaScript", category: "Coding" },
  ],
  "demo-user-2": [
    { skillName: "Guitar", category: "Music" },
    { skillName: "Music Theory", category: "Music" },
  ],
  "demo-user-3": [
    { skillName: "Photography", category: "Photography" },
    { skillName: "Photo Editing", category: "Photography" },
  ],
  "demo-user-4": [
    { skillName: "Fitness", category: "Fitness" },
    { skillName: "Yoga", category: "Fitness" },
    { skillName: "Nutrition", category: "Fitness" },
  ],
};

export const mockSkillsLearn: Record<string, { skillName: string; category: string }[]> = {
  "demo-user-5": [
    { skillName: "Video Editing", category: "Video Editing" },
    { skillName: "Guitar", category: "Music" },
  ],
  "demo-user-6": [
    { skillName: "Guitar", category: "Music" },
    { skillName: "Photography", category: "Photography" },
  ],
};

// ─── Courses ────────────────────────────────────────────────────────────────
export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number;
  order: number;
  isFreePreview: boolean;
}

export interface Course {
  id: string;
  coachId: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  isFree: boolean;
  spPrice?: number;
  totalLessons: number;
  totalEnrolled: number;
  averageRating: number;
  isPublished: boolean;
  isFeatured: boolean;
  lessons: Lesson[];
}

export const mockCourses: Course[] = [
  {
    id: "course-1",
    coachId: "demo-user-1",
    title: "Python for Beginners: From Zero to Hero",
    description:
      "Learn Python from scratch! This comprehensive course covers variables, data types, control flow, functions, OOP, and real-world projects. Perfect for absolute beginners who want to start their coding journey.",
    thumbnail: "/images/course-python.jpg",
    category: "Coding",
    isFree: true,
    totalLessons: 12,
    totalEnrolled: 234,
    averageRating: 4.8,
    isPublished: true,
    isFeatured: true,
    lessons: [
      { id: "l1-1", title: "Introduction to Python", content: "Welcome to Python! In this lesson, we'll set up your development environment and write your first program.", duration: 15, order: 1, isFreePreview: true },
      { id: "l1-2", title: "Variables & Data Types", content: "Learn about strings, integers, floats, booleans, and how to store data in variables.", duration: 20, order: 2, isFreePreview: false },
      { id: "l1-3", title: "Control Flow", content: "Master if-else statements, for loops, and while loops.", duration: 25, order: 3, isFreePreview: false },
      { id: "l1-4", title: "Functions", content: "Learn to write reusable code with functions, parameters, and return values.", duration: 20, order: 4, isFreePreview: false },
      { id: "l1-5", title: "Lists & Dictionaries", content: "Work with Python's most versatile data structures.", duration: 25, order: 5, isFreePreview: false },
    ],
  },
  {
    id: "course-2",
    coachId: "demo-user-2",
    title: "Guitar Fundamentals: Play Your First Song",
    description:
      "Always wanted to play guitar? This course takes you from holding the guitar to playing your first complete song. Covers chords, strumming patterns, and basic music theory.",
    thumbnail: "/images/course-guitar.jpg",
    category: "Music",
    isFree: true,
    totalLessons: 8,
    totalEnrolled: 178,
    averageRating: 4.6,
    isPublished: true,
    isFeatured: false,
    lessons: [
      { id: "l2-1", title: "Holding the Guitar", content: "Proper posture, hand positioning, and how to hold a pick.", duration: 10, order: 1, isFreePreview: true },
      { id: "l2-2", title: "Your First Chords: E, A, D", content: "Learn the three essential open chords to start playing songs.", duration: 20, order: 2, isFreePreview: false },
      { id: "l2-3", title: "Strumming Patterns", content: "Basic down-up strumming patterns that work with most songs.", duration: 15, order: 3, isFreePreview: false },
    ],
  },
  {
    id: "course-3",
    coachId: "demo-user-3",
    title: "Photography Masterclass: Composition & Lighting",
    description:
      "Learn the art and science of photography. From rule of thirds to golden hour lighting, master the techniques professionals use to create stunning images.",
    thumbnail: "/images/course-photo.jpg",
    category: "Photography",
    isFree: false,
    spPrice: 50,
    totalLessons: 10,
    totalEnrolled: 92,
    averageRating: 4.9,
    isPublished: true,
    isFeatured: true,
    lessons: [
      { id: "l3-1", title: "Understanding Your Camera", content: "ISO, aperture, shutter speed explained in simple terms.", duration: 20, order: 1, isFreePreview: true },
      { id: "l3-2", title: "Composition Rules", content: "Rule of thirds, leading lines, symmetry, and framing techniques.", duration: 25, order: 2, isFreePreview: false },
    ],
  },
  {
    id: "course-4",
    coachId: "demo-user-1",
    title: "React & Next.js: Build Modern Web Apps",
    description:
      "Go beyond basics and learn React with Next.js. Build production-ready web applications with server components, API routes, and deployment.",
    thumbnail: "/images/course-python.jpg",
    category: "Coding",
    isFree: false,
    spPrice: 100,
    totalLessons: 15,
    totalEnrolled: 156,
    averageRating: 4.7,
    isPublished: true,
    isFeatured: false,
    lessons: [
      { id: "l4-1", title: "React Hooks Deep Dive", content: "useState, useEffect, useContext, useReducer and custom hooks.", duration: 30, order: 1, isFreePreview: true },
      { id: "l4-2", title: "Next.js App Router", content: "File-based routing, layouts, loading states, and server components.", duration: 35, order: 2, isFreePreview: false },
    ],
  },
  {
    id: "course-5",
    coachId: "demo-user-4",
    title: "Home Workout Plan: No Equipment Needed",
    description:
      "Get fit at home with this bodyweight-only workout program. Progressive difficulty over 4 weeks with video demonstrations for every exercise.",
    thumbnail: "/images/course-fitness.jpg",
    category: "Fitness",
    isFree: true,
    totalLessons: 6,
    totalEnrolled: 312,
    averageRating: 4.5,
    isPublished: true,
    isFeatured: false,
    lessons: [
      { id: "l5-1", title: "Getting Started", content: "Assess your fitness level and set realistic goals.", duration: 10, order: 1, isFreePreview: true },
      { id: "l5-2", title: "Week 1: Foundation", content: "Basic bodyweight exercises to build your foundation.", duration: 20, order: 2, isFreePreview: false },
    ],
  },
  {
    id: "course-6",
    coachId: "demo-user-3",
    title: "Video Editing with DaVinci Resolve",
    description:
      "Learn professional video editing with the free DaVinci Resolve software. From basic cuts to color grading and effects.",
    thumbnail: "/images/course-video.jpg",
    category: "Video Editing",
    isFree: false,
    spPrice: 75,
    totalLessons: 14,
    totalEnrolled: 67,
    averageRating: 4.4,
    isPublished: true,
    isFeatured: false,
    lessons: [
      { id: "l6-1", title: "Interface Overview", content: "Navigate the DaVinci Resolve interface and understand the workflow.", duration: 15, order: 1, isFreePreview: true },
    ],
  },
];

// ─── Enrollments (for current user demo-user-5) ─────────────────────────────
export interface Enrollment {
  courseId: string;
  userId: string;
  progress: number;
}

export const mockEnrollments: Enrollment[] = [
  { courseId: "course-1", userId: "demo-user-5", progress: 65 },
  { courseId: "course-3", userId: "demo-user-5", progress: 10 },
];

// ─── Conversations & Messages ───────────────────────────────────────────────
export interface Message {
  id: string;
  senderId: string;
  content: string;
  messageType: "TEXT";
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessageAt: string;
}

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: ["demo-user-5", "demo-user-1"],
    messages: [
      { id: "m1", senderId: "demo-user-5", content: "Hi Priya! I'm really enjoying your Python course. Can you help me with functions?", messageType: "TEXT", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: "m2", senderId: "demo-user-1", content: "Hey Sneha! Of course! What specifically are you struggling with?", messageType: "TEXT", createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString() },
      { id: "m3", senderId: "demo-user-5", content: "I don't understand the difference between parameters and arguments 😅", messageType: "TEXT", createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: "m4", senderId: "demo-user-1", content: "Great question! Think of it this way: a parameter is the variable name in the function definition, and an argument is the actual value you pass when calling the function. Like: def greet(name): → name is the parameter. greet('Sneha') → 'Sneha' is the argument.", messageType: "TEXT", createdAt: new Date(Date.now() - 1800000).toISOString() },
      { id: "m5", senderId: "demo-user-5", content: "Oh that makes so much sense! Thanks! 🙏", messageType: "TEXT", createdAt: new Date(Date.now() - 900000).toISOString() },
    ],
    lastMessageAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "conv-2",
    participants: ["demo-user-5", "demo-user-3"],
    messages: [
      { id: "m6", senderId: "demo-user-5", content: "Ananya, I loved your photography course! The composition lesson was amazing", messageType: "TEXT", createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: "m7", senderId: "demo-user-3", content: "Thank you so much Sneha! Glad it helped. Would you be interested in a 1-on-1 session to practice?", messageType: "TEXT", createdAt: new Date(Date.now() - 82800000).toISOString() },
    ],
    lastMessageAt: new Date(Date.now() - 82800000).toISOString(),
  },
  {
    id: "conv-3",
    participants: ["demo-user-5", "demo-user-2"],
    messages: [
      { id: "m8", senderId: "demo-user-2", content: "Hey Sneha! Welcome to SkillSwap! 🎉", messageType: "TEXT", createdAt: new Date(Date.now() - 172800000).toISOString() },
      { id: "m9", senderId: "demo-user-5", content: "Hi Rahul! Thanks, I'm excited to start learning guitar!", messageType: "TEXT", createdAt: new Date(Date.now() - 169200000).toISOString() },
    ],
    lastMessageAt: new Date(Date.now() - 169200000).toISOString(),
  },
];

// ─── Reviews ────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const mockReviews: Review[] = [
  { id: "r1", reviewerId: "demo-user-5", revieweeId: "demo-user-1", rating: 5, comment: "Amazing teacher! Very patient and explains concepts clearly.", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "r2", reviewerId: "demo-user-6", revieweeId: "demo-user-2", rating: 4, comment: "Great guitar lesson! Learned chords quickly.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "r3", reviewerId: "demo-user-2", revieweeId: "demo-user-3", rating: 5, comment: "Ananya's photography tips are gold. My Instagram game leveled up!", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "r4", reviewerId: "demo-user-3", revieweeId: "demo-user-4", rating: 5, comment: "Arjun's fitness plan is incredible. Lost 5kg in a month!", createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: "r5", reviewerId: "demo-user-1", revieweeId: "demo-user-4", rating: 4, comment: "Very knowledgeable trainer. Pushes you just the right amount.", createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: "r6", reviewerId: "demo-user-6", revieweeId: "demo-user-1", rating: 5, comment: "Priya is the best coding tutor I've ever had. Highly recommend!", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
];

// ─── Notifications ──────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const mockNotifications: Notification[] = [
  { id: "n1", userId: "demo-user-5", type: "SESSION_CONFIRMED", title: "Session Confirmed!", message: "Priya confirmed your Python session for tomorrow at 3 PM", isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "n2", userId: "demo-user-5", type: "NEW_MESSAGE", title: "New Message", message: "Priya sent you a message about functions", isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "n3", userId: "demo-user-5", type: "SP_EARNED", title: "SP Earned!", message: "You earned 10 SP for completing your profile", isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "n4", userId: "demo-user-5", type: "SYSTEM", title: "Welcome to SkillSwap! 🎉", message: "Start by browsing coaches and booking your first session.", isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

// ─── Leaderboard ────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  userId: string;
  name: string;
  username: string;
  image: string | null;
  leagueTier: string;
  xp: number;
  points: number;
}

export const mockLeaderboard: LeaderboardEntry[] = [
  { userId: "demo-user-4", name: "Arjun Kumar", username: "arjunkumar", image: "/images/avatar-coach-4.jpg", leagueTier: "EXPERT", xp: 6200, points: 89 },
  { userId: "demo-user-1", name: "Priya Sharma", username: "priyasharma", image: "/images/avatar-coach-1.jpg", leagueTier: "PRO", xp: 2500, points: 62 },
  { userId: "demo-user-2", name: "Rahul Verma", username: "rahulverma", image: "/images/avatar-coach-2.jpg", leagueTier: "SKILLED", xp: 1200, points: 40 },
  { userId: "demo-user-3", name: "Ananya Patel", username: "ananyapatel", image: "/images/avatar-coach-3.jpg", leagueTier: "LEARNER", xp: 450, points: 30 },
  { userId: "demo-user-5", name: "Sneha Reddy", username: "snehareddy", image: null, leagueTier: "LEARNER", xp: 350, points: 16 },
  { userId: "demo-user-6", name: "Vikram Singh", username: "vikramsingh", image: null, leagueTier: "STARTER", xp: 80, points: 3 },
];

// ─── SP Transactions (for demo-user-5) ──────────────────────────────────────
export interface SPTransaction {
  id: string;
  userId: string;
  type: "EARNED" | "SPENT";
  amount: number;
  reason: string;
  createdAt: string;
}

export const mockTransactions: SPTransaction[] = [
  { id: "t1", userId: "demo-user-5", type: "EARNED", amount: 50, reason: "Welcome bonus", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "t2", userId: "demo-user-5", type: "SPENT", amount: 30, reason: "Booked session: Python with Priya", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "t3", userId: "demo-user-5", type: "EARNED", amount: 10, reason: "Completed onboarding profile", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "t4", userId: "demo-user-5", type: "SPENT", amount: 50, reason: "Enrolled: Photography Masterclass", createdAt: new Date(Date.now() - 43200000).toISOString() },
  { id: "t5", userId: "demo-user-5", type: "EARNED", amount: 15, reason: "Teach a session reward", createdAt: new Date(Date.now() - 21600000).toISOString() },
  { id: "t6", userId: "demo-user-5", type: "EARNED", amount: 5, reason: "Wrote a review", createdAt: new Date(Date.now() - 7200000).toISOString() },
];

// ─── Availability Slots ─────────────────────────────────────────────────────
export interface AvailabilitySlot {
  coachId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export const mockAvailability: AvailabilitySlot[] = [
  { coachId: "demo-user-1", dayOfWeek: 1, startTime: "10:00", endTime: "11:00" },
  { coachId: "demo-user-1", dayOfWeek: 1, startTime: "14:00", endTime: "15:00" },
  { coachId: "demo-user-1", dayOfWeek: 2, startTime: "10:00", endTime: "12:00" },
  { coachId: "demo-user-1", dayOfWeek: 3, startTime: "15:00", endTime: "17:00" },
  { coachId: "demo-user-1", dayOfWeek: 4, startTime: "10:00", endTime: "11:00" },
  { coachId: "demo-user-2", dayOfWeek: 1, startTime: "16:00", endTime: "17:00" },
  { coachId: "demo-user-2", dayOfWeek: 3, startTime: "16:00", endTime: "18:00" },
  { coachId: "demo-user-2", dayOfWeek: 5, startTime: "10:00", endTime: "12:00" },
  { coachId: "demo-user-3", dayOfWeek: 2, startTime: "09:00", endTime: "11:00" },
  { coachId: "demo-user-3", dayOfWeek: 4, startTime: "13:00", endTime: "15:00" },
  { coachId: "demo-user-3", dayOfWeek: 6, startTime: "10:00", endTime: "12:00" },
  { coachId: "demo-user-4", dayOfWeek: 1, startTime: "06:00", endTime: "08:00" },
  { coachId: "demo-user-4", dayOfWeek: 2, startTime: "06:00", endTime: "08:00" },
  { coachId: "demo-user-4", dayOfWeek: 3, startTime: "17:00", endTime: "19:00" },
  { coachId: "demo-user-4", dayOfWeek: 4, startTime: "06:00", endTime: "08:00" },
  { coachId: "demo-user-4", dayOfWeek: 5, startTime: "06:00", endTime: "08:00" },
];

// ─── Helper functions ───────────────────────────────────────────────────────
export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getCoachById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id && u.role === "COACH");
}

export function getCourseById(id: string): Course | undefined {
  return mockCourses.find((c) => c.id === id);
}

export function getConversationById(id: string): Conversation | undefined {
  return mockConversations.find((c) => c.id === id);
}

export function getReviewsForUser(userId: string): Review[] {
  return mockReviews.filter((r) => r.revieweeId === userId);
}

export function getNotificationsForUser(userId: string): Notification[] {
  return mockNotifications.filter((n) => n.userId === userId);
}

export function getTransactionsForUser(userId: string): SPTransaction[] {
  return mockTransactions.filter((t) => t.userId === userId);
}

export function getAvailabilityForCoach(coachId: string): AvailabilitySlot[] {
  return mockAvailability.filter((s) => s.coachId === coachId);
}

export function getCoaches(): User[] {
  return mockUsers.filter((u) => u.role === "COACH");
}

export const demoUser5: User = mockUsers[4];
