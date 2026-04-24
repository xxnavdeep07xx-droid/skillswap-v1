import { db } from "@/lib/db";

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  const tablenames = [
    "Report", "Notification", "CourseEnrollment", "Lesson", "Course",
    "Message", "ConversationParticipant", "Conversation",
    "CoinTransaction", "Review", "AvailabilitySlot", "Session",
    "SkillLearn", "SkillTeach", "User",
  ];
  for (const t of tablenames) {
    try { await db.$executeRawUnsafe(`DELETE FROM ${t}`); } catch {}
  }

  // Create demo users
  const users = await Promise.all([
    db.user.create({
      data: {
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
        lastActiveAt: new Date(),
        totalSessionsTaught: 47,
        totalSessionsLearned: 15,
        averageRating: 4.8,
        onboardingCompleted: true,
      },
    }),
    db.user.create({
      data: {
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
        lastActiveAt: new Date(),
        totalSessionsTaught: 32,
        totalSessionsLearned: 8,
        averageRating: 4.6,
        onboardingCompleted: true,
      },
    }),
    db.user.create({
      data: {
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
        lastActiveAt: new Date(),
        totalSessionsTaught: 18,
        totalSessionsLearned: 12,
        averageRating: 4.9,
        onboardingCompleted: true,
      },
    }),
    db.user.create({
      data: {
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
        lastActiveAt: new Date(),
        totalSessionsTaught: 89,
        totalSessionsLearned: 5,
        averageRating: 4.7,
        onboardingCompleted: true,
      },
    }),
    db.user.create({
      data: {
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
        lastActiveAt: new Date(),
        totalSessionsTaught: 2,
        totalSessionsLearned: 14,
        averageRating: 0,
        onboardingCompleted: true,
      },
    }),
    db.user.create({
      data: {
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
        lastActiveAt: new Date(),
        totalSessionsTaught: 0,
        totalSessionsLearned: 3,
        averageRating: 0,
        onboardingCompleted: true,
      },
    }),
  ]);

  // Skills
  const skillsTeachData = [
    { userId: "demo-user-1", skillName: "Python", category: "Coding" },
    { userId: "demo-user-1", skillName: "React", category: "Coding" },
    { userId: "demo-user-1", skillName: "JavaScript", category: "Coding" },
    { userId: "demo-user-2", skillName: "Guitar", category: "Music" },
    { userId: "demo-user-2", skillName: "Music Theory", category: "Music" },
    { userId: "demo-user-3", skillName: "Photography", category: "Photography" },
    { userId: "demo-user-3", skillName: "Photo Editing", category: "Photography" },
    { userId: "demo-user-4", skillName: "Fitness", category: "Fitness" },
    { userId: "demo-user-4", skillName: "Yoga", category: "Fitness" },
    { userId: "demo-user-4", skillName: "Nutrition", category: "Fitness" },
  ];

  const skillsLearnData = [
    { userId: "demo-user-5", skillName: "Video Editing", category: "Video Editing" },
    { userId: "demo-user-5", skillName: "Guitar", category: "Music" },
    { userId: "demo-user-6", skillName: "Guitar", category: "Music" },
    { userId: "demo-user-6", skillName: "Photography", category: "Photography" },
  ];

  await Promise.all(skillsTeachData.map(s => db.skillTeach.create({ data: s })));
  await Promise.all(skillsLearnData.map(s => db.skillLearn.create({ data: s })));

  // Courses
  const courses = await Promise.all([
    db.course.create({
      data: {
        id: "course-1",
        coachId: "demo-user-1",
        title: "Python for Beginners: From Zero to Hero",
        description: "Learn Python from scratch! This comprehensive course covers variables, data types, control flow, functions, OOP, and real-world projects. Perfect for absolute beginners who want to start their coding journey.",
        thumbnail: "/images/course-python.jpg",
        category: "Coding",
        isFree: true,
        totalLessons: 12,
        totalEnrolled: 234,
        averageRating: 4.8,
        isPublished: true,
        isFeatured: true,
        lessons: {
          create: [
            { title: "Introduction to Python", content: "Welcome to Python! In this lesson, we'll set up your development environment and write your first program.", duration: 15, order: 1, isFreePreview: true },
            { title: "Variables & Data Types", content: "Learn about strings, integers, floats, booleans, and how to store data in variables.", duration: 20, order: 2, isFreePreview: false },
            { title: "Control Flow", content: "Master if-else statements, for loops, and while loops.", duration: 25, order: 3, isFreePreview: false },
            { title: "Functions", content: "Learn to write reusable code with functions, parameters, and return values.", duration: 20, order: 4, isFreePreview: false },
            { title: "Lists & Dictionaries", content: "Work with Python's most versatile data structures.", duration: 25, order: 5, isFreePreview: false },
          ],
        },
      },
      include: { lessons: true },
    }),
    db.course.create({
      data: {
        id: "course-2",
        coachId: "demo-user-2",
        title: "Guitar Fundamentals: Play Your First Song",
        description: "Always wanted to play guitar? This course takes you from holding the guitar to playing your first complete song. Covers chords, strumming patterns, and basic music theory.",
        thumbnail: "/images/course-guitar.jpg",
        category: "Music",
        isFree: true,
        totalLessons: 8,
        totalEnrolled: 178,
        averageRating: 4.6,
        isPublished: true,
        isFeatured: false,
        lessons: {
          create: [
            { title: "Holding the Guitar", content: "Proper posture, hand positioning, and how to hold a pick.", duration: 10, order: 1, isFreePreview: true },
            { title: "Your First Chords: E, A, D", content: "Learn the three essential open chords to start playing songs.", duration: 20, order: 2, isFreePreview: false },
            { title: "Strumming Patterns", content: "Basic down-up strumming patterns that work with most songs.", duration: 15, order: 3, isFreePreview: false },
          ],
        },
      },
      include: { lessons: true },
    }),
    db.course.create({
      data: {
        id: "course-3",
        coachId: "demo-user-3",
        title: "Photography Masterclass: Composition & Lighting",
        description: "Learn the art and science of photography. From rule of thirds to golden hour lighting, master the techniques professionals use to create stunning images.",
        thumbnail: "/images/course-photo.jpg",
        category: "Photography",
        isFree: false,
        spPrice: 50,
        totalLessons: 10,
        totalEnrolled: 92,
        averageRating: 4.9,
        isPublished: true,
        isFeatured: true,
        lessons: {
          create: [
            { title: "Understanding Your Camera", content: "ISO, aperture, shutter speed explained in simple terms.", duration: 20, order: 1, isFreePreview: true },
            { title: "Composition Rules", content: "Rule of thirds, leading lines, symmetry, and framing techniques.", duration: 25, order: 2, isFreePreview: false },
          ],
        },
      },
      include: { lessons: true },
    }),
    db.course.create({
      data: {
        id: "course-4",
        coachId: "demo-user-1",
        title: "React & Next.js: Build Modern Web Apps",
        description: "Go beyond basics and learn React with Next.js. Build production-ready web applications with server components, API routes, and deployment.",
        thumbnail: "/images/course-python.jpg",
        category: "Coding",
        isFree: false,
        spPrice: 100,
        totalLessons: 15,
        totalEnrolled: 156,
        averageRating: 4.7,
        isPublished: true,
        isFeatured: false,
        lessons: {
          create: [
            { title: "React Hooks Deep Dive", content: "useState, useEffect, useContext, useReducer and custom hooks.", duration: 30, order: 1, isFreePreview: true },
            { title: "Next.js App Router", content: "File-based routing, layouts, loading states, and server components.", duration: 35, order: 2, isFreePreview: false },
          ],
        },
      },
      include: { lessons: true },
    }),
    db.course.create({
      data: {
        id: "course-5",
        coachId: "demo-user-4",
        title: "Home Workout Plan: No Equipment Needed",
        description: "Get fit at home with this bodyweight-only workout program. Progressive difficulty over 4 weeks with video demonstrations for every exercise.",
        thumbnail: "/images/course-fitness.jpg",
        category: "Fitness",
        isFree: true,
        totalLessons: 6,
        totalEnrolled: 312,
        averageRating: 4.5,
        isPublished: true,
        isFeatured: false,
        lessons: {
          create: [
            { title: "Getting Started", content: "Assess your fitness level and set realistic goals.", duration: 10, order: 1, isFreePreview: true },
            { title: "Week 1: Foundation", content: "Basic bodyweight exercises to build your foundation.", duration: 20, order: 2, isFreePreview: false },
          ],
        },
      },
      include: { lessons: true },
    }),
    db.course.create({
      data: {
        id: "course-6",
        coachId: "demo-user-3",
        title: "Video Editing with DaVinci Resolve",
        description: "Learn professional video editing with the free DaVinci Resolve software. From basic cuts to color grading and effects.",
        thumbnail: "/images/course-video.jpg",
        category: "Video Editing",
        isFree: false,
        spPrice: 75,
        totalLessons: 14,
        totalEnrolled: 67,
        averageRating: 4.4,
        isPublished: true,
        isFeatured: false,
        lessons: {
          create: [
            { title: "Interface Overview", content: "Navigate the DaVinci Resolve interface and understand the workflow.", duration: 15, order: 1, isFreePreview: true },
          ],
        },
      },
      include: { lessons: true },
    }),
  ]);

  // Course enrollments
  await db.courseEnrollment.createMany({
    data: [
      { courseId: "course-1", userId: "demo-user-5", progress: 65 },
      { courseId: "course-1", userId: "demo-user-6", progress: 20 },
      { courseId: "course-2", userId: "demo-user-6", progress: 45 },
      { courseId: "course-3", userId: "demo-user-5", progress: 10 },
    ],
  });

  // Conversations
  const conv1 = await db.conversation.create({ data: {} });
  const conv2 = await db.conversation.create({ data: {} });
  const conv3 = await db.conversation.create({ data: {} });

  await db.conversationParticipant.createMany({
    data: [
      { conversationId: conv1.id, userId: "demo-user-5" },
      { conversationId: conv1.id, userId: "demo-user-1" },
      { conversationId: conv2.id, userId: "demo-user-6" },
      { conversationId: conv2.id, userId: "demo-user-2" },
      { conversationId: conv3.id, userId: "demo-user-5" },
      { conversationId: conv3.id, userId: "demo-user-3" },
    ],
  });

  // Messages
  await db.message.createMany({
    data: [
      { conversationId: conv1.id, senderId: "demo-user-5", content: "Hi Priya! I'm really enjoying your Python course. Can you help me with functions?", messageType: "TEXT" },
      { conversationId: conv1.id, senderId: "demo-user-1", content: "Hey Sneha! Of course! What specifically are you struggling with?", messageType: "TEXT" },
      { conversationId: conv1.id, senderId: "demo-user-5", content: "I don't understand the difference between parameters and arguments 😅", messageType: "TEXT" },
      { conversationId: conv1.id, senderId: "demo-user-1", content: "Great question! Think of it this way: a parameter is the variable name in the function definition, and an argument is the actual value you pass when calling the function. Like: def greet(name): → name is the parameter. greet('Sneha') → 'Sneha' is the argument.", messageType: "TEXT" },
      { conversationId: conv1.id, senderId: "demo-user-5", content: "Oh that makes so much sense! Thanks! 🙏", messageType: "TEXT" },
      { conversationId: conv2.id, senderId: "demo-user-6", content: "Hey Rahul, is the guitar course good for absolute beginners?", messageType: "TEXT" },
      { conversationId: conv2.id, senderId: "demo-user-2", content: "Absolutely! I designed it specifically for people who've never held a guitar before. You'll be playing songs by week 2!", messageType: "TEXT" },
      { conversationId: conv3.id, senderId: "demo-user-5", content: "Ananya, I loved your photography course! The composition lesson was amazing", messageType: "TEXT" },
      { conversationId: conv3.id, senderId: "demo-user-3", content: "Thank you so much Sneha! Glad it helped. Would you be interested in a 1-on-1 session to practice?", messageType: "TEXT" },
    ],
  });

  // Sessions (demo)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(15, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);
  nextWeek.setHours(11, 0, 0, 0);

  await db.session.createMany({
    data: [
      {
        id: "session-1",
        coachId: "demo-user-1",
        learnerId: "demo-user-5",
        skillName: "Python",
        status: "CONFIRMED",
        scheduledAt: tomorrow,
        durationMins: 60,
        spCost: 30,
        jitsiRoomUrl: "https://meet.jit.si/skillswap-demo-user-1-demo-user-5-1700000000",
      },
      {
        id: "session-2",
        coachId: "demo-user-2",
        learnerId: "demo-user-6",
        skillName: "Guitar",
        status: "PENDING",
        scheduledAt: nextWeek,
        durationMins: 45,
        spCost: 25,
      },
    ],
  });

  // Reviews (linked to existing sessions)
  await db.review.createMany({
    data: [
      { sessionId: "session-1", reviewerId: "demo-user-5", revieweeId: "demo-user-1", rating: 5, comment: "Amazing teacher! Very patient and explains concepts clearly." },
      { sessionId: "session-2", reviewerId: "demo-user-6", revieweeId: "demo-user-2", rating: 4, comment: "Great guitar lesson! Learned chords quickly." },
    ],
  });

  // Coin transactions
  await db.coinTransaction.createMany({
    data: [
      { userId: "demo-user-5", type: "EARNED", amount: 50, reason: "Welcome bonus" },
      { userId: "demo-user-5", type: "SPENT", amount: 30, reason: "Booked session: Python with Priya" },
      { userId: "demo-user-5", type: "EARNED", amount: 10, reason: "Completed onboarding profile" },
      { userId: "demo-user-5", type: "SPENT", amount: 50, reason: "Enrolled: Photography Masterclass" },
    ],
  });

  // Notifications
  await db.notification.createMany({
    data: [
      { userId: "demo-user-5", type: "SESSION_CONFIRMED", title: "Session Confirmed!", message: "Priya confirmed your Python session for tomorrow at 3 PM", isRead: false },
      { userId: "demo-user-5", type: "NEW_MESSAGE", title: "New Message", message: "Priya sent you a message about functions", isRead: false },
      { userId: "demo-user-5", type: "SP_EARNED", title: "SP Earned!", message: "You earned 10 SP for completing your profile", isRead: true },
      { userId: "demo-user-5", type: "SYSTEM", title: "Welcome to SkillSwap! 🎉", message: "Start by browsing coaches and booking your first session.", isRead: true },
    ],
  });

  // Availability slots
  await db.availabilitySlot.createMany({
    data: [
      { coachId: "demo-user-1", dayOfWeek: 1, startTime: "10:00", endTime: "11:00" },
      { coachId: "demo-user-1", dayOfWeek: 1, startTime: "14:00", endTime: "15:00" },
      { coachId: "demo-user-1", dayOfWeek: 2, startTime: "10:00", endTime: "12:00" },
      { coachId: "demo-user-1", dayOfWeek: 3, startTime: "15:00", endTime: "17:00" },
      { coachId: "demo-user-1", dayOfWeek: 4, startTime: "10:00", endTime: "11:00" },
      { coachId: "demo-user-2", dayOfWeek: 1, startTime: "16:00", endTime: "17:00" },
      { coachId: "demo-user-2", dayOfWeek: 3, startTime: "16:00", endTime: "18:00" },
      { coachId: "demo-user-2", dayOfWeek: 5, startTime: "10:00", endTime: "12:00" },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log(`Created ${users.length} users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
