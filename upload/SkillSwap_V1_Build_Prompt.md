# SkillSwap — Complete V1 Build Prompt

## Project Overview

**SkillSwap** is a skill-barter learning platform where users can teach skills they know and learn skills they want from others. It uses a credit/points system (not direct barter) so users earn Skill Points (SP) by teaching and spend SP to learn from anyone. The app is a **Progressive Web App (PWA)** built with Next.js, targeting college students and learners in India.

**Core loop:** Sign up → Onboarding (add skills you teach + skills you want to learn) → Browse coaches or get discovered → Book sessions → Complete session via Video/Voice/Chat/Screen Share → Rate each other → Earn SP → Level up through leagues → Unlock privileges (Coach badge, course creation, priority listing).

**Design philosophy:** "Duolingo meets Skillshare" — fun, inviting, motivating. NOT intimidating. Light theme primary. Rounded corners everywhere. Warm Indigo + Orange palette.

---

## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Framework | Next.js 15 (App Router) | Proven from Aether Arena |
| Language | TypeScript | Type safety, familiar codebase |
| Styling | Tailwind CSS + shadcn/ui | Consistent components, fast dev |
| Database | Prisma + PostgreSQL | Familiar ORM, relational data |
| Auth | NextAuth with Google OAuth | Students sign up with Gmail |
| Real-time | Socket.io | Chat, notifications, leaderboard updates |
| Video/Voice/Screen Share | Jitsi Meet (iframe embed) | Free, open source, auto-generated room links |
| Text Chat | Custom with Socket.io + Prisma | Full control, no external cost |
| File Storage | Cloudinary | Profile pictures, showcase videos, course thumbnails |
| Hosting | Vercel | Same deployment flow as Aether Arena |
| PWA | next-pwa | Installable, offline support, service worker |

**What's NOT in V1:** Razorpay (real money payments), Admin Panel, Achievement System, Donate Button, Dark Mode, Push Notifications. These are V2 additions.

---

## Design System

### Color Palette

```
Primary:        #4F46E5 (Indigo)        — Buttons, links, active states
Primary Light:  #818CF8 (Indigo 400)    — Hover states, secondary highlights
Accent/CTA:     #F97316 (Orange)        — Primary action buttons (Book Now, Start, Buy)
Success:        #10B981 (Emerald)       — Completed sessions, streaks, confirmations
Warning:        #F59E0B (Amber)         — Streak about to break, pending items
Error:          #EF4444 (Red)           — Errors, cancellations, report flags
Background:     #F8FAFC (Slate 50)      — Main page background
Surface:        #FFFFFF                 — Cards, modals, sheets
Card Hover:     #F1F5F9 (Slate 100)    — Hover state for cards
Text Primary:   #1E293B (Slate 900)     — Main body text
Text Secondary: #64748B (Slate 500)     — Subtitles, descriptions, metadata
Text Muted:     #94A3B8 (Slate 400)     — Captions, timestamps, placeholders
Border:         #E2E8F0 (Slate 200)     — Dividers, card borders, input borders
```

### Typography

- **Font:** Inter (Google Fonts) — clean, modern, excellent readability at all sizes
- **Headings:** Semi-bold (600), Slate 900
- **Body:** Regular (400), Slate 700
- **Captions/Meta:** Regular (400), Slate 400
- **Font sizes:** Use Tailwind scale: `text-xs` (11px, captions), `text-sm` (14px, body), `text-base` (16px, emphasis), `text-lg` (18px, section titles), `text-xl`–`text-2xl` (page titles)

### Component Style Rules

| Property | Value |
|----------|-------|
| Border radius (cards) | `rounded-xl` (12px) |
| Border radius (modals/sheets) | `rounded-2xl` (16px) |
| Border radius (badges/tags) | `rounded-full` (9999px) |
| Border radius (buttons) | `rounded-full` (9999px) |
| Card shadow | `0 1px 3px rgba(0,0,0,0.08)` |
| Modal shadow | `0 4px 12px rgba(0,0,0,0.12)` |
| Button padding | `12px 24px` |
| Button hover | `transform: scale(1.02)`, 150ms ease transition |
| Primary buttons | Orange (#F97316) bg, white text |
| Secondary buttons | White bg, Indigo border (#4F46E5), Indigo text |
| Icons | Lucide React (consistent with shadcn/ui) |
| Page transitions | Subtle fade-in |
| Streak fire | Gentle pulse/bounce animation |
| Progress bars | Smooth fill animation |

### Theme Mode

- **V1: Light mode only.** Do NOT build dark mode toggle in V1. The entire design is light-first.
- Dark mode is a V2 feature.

---

## Layout Architecture

### Global Layout

- **Mobile-first PWA** — designed for 375px–428px viewport, responsive up to tablet (768px) and desktop (1024px+)
- **Top:** No permanent top navigation bar. Each section has its own section-specific header.
- **Bottom:** Floating navigation bar, fixed at bottom center. See "Bottom Navigation Bar" section below.
- **Safe area:** Account for iPhone notch and home indicator with `pb-[env(safe-area-inset-bottom)]`.
- **Content area:** Scrollable body between the section header and the bottom nav bar. Add bottom padding equal to nav bar height (64px) so content isn't hidden behind it.

### Desktop/Tablet Responsive Behavior

- **Mobile (< 768px):** Full-width layout, single column, bottom nav visible
- **Tablet (768px–1024px):** Max-width container (640px), centered, bottom nav visible
- **Desktop (> 1024px):** Max-width container (480px or 520px), centered, bottom nav becomes a left sidebar or top nav (convert to web-style navigation). App still looks like a phone app even on desktop (similar to WhatsApp Web approach).

---

## Bottom Navigation Bar

A floating pill-shaped bar fixed at the bottom center of the screen with 5 icon + label tabs:

```
┌──────────────────────────────────────────────┐
│  🏠       🎓        💬       🏆        👤   │
│  Home     Coach    Chat    Board    Profile  │
└──────────────────────────────────────────────┘
```

### Specifications

- **Active tab:** Icon filled + Indigo (#4F46E5) color + label font-semibold in Indigo-600
- **Inactive tab:** Icon outline + Slate-400 color + label font-normal in Slate-400
- **Container styling:** `bg-white/90 backdrop-blur-xl border border-slate-200 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)]`
- **Positioning:** `fixed bottom-0 left-0 right-0`, centered with `max-w-md mx-auto` on desktop
- **Height:** 64px internal height + `pb-[env(safe-area-inset-bottom)]`
- **Badge indicators:** Red dot on Chat tab when unread messages exist. Red dot on Notification bell (inside Home header) for pending notifications.
- **Animation:** Active tab icon gets a subtle scale bounce on tap (`transform: scale(1.15)` → `scale(1)` over 200ms)
- **Haptic feedback:** On mobile, add a subtle tactile vibration on tab switch (if supported).

---

## Section-by-Section Specification

---

### 1. HOME SECTION

#### Header (sticky at top)

- **Left:** Search bar
  - Style: `rounded-full bg-slate-100 pl-10 pr-4 py-2.5`
  - Placeholder: "Search skills, courses, coaches..."
  - Search icon (Lucide: `Search`) positioned absolutely inside, left side, Slate-400
  - On tap/click: Expands to full search overlay with:
    - Recent searches (stored locally, max 8, clearable)
    - Trending skills this week (fetched from API)
  - Search behavior: Filters results in real-time as user types (debounced, 300ms)
- **Right:** Two icon buttons stacked horizontally
  - **Tasks icon** (Lucide: `CheckSquare` or `ClipboardList`)
    - Tap → opens bottom sheet with daily tasks
    - Tasks list with each showing: task description, SP reward amount, checkmark if completed
    - Example tasks: "Teach a session (+15 SP)", "Complete your streak (+3 SP)", "Write a review (+5 SP)", "Refer a friend (+20 SP)"
    - "Claim All" button at bottom if multiple tasks are completed
  - **Notification bell icon** (Lucide: `Bell`)
    - Red dot overlay if unread notifications exist
    - Tap → opens Notification panel (full page or slide-over from right)
    - Notification types: session booked/confirmed/reminder, new message, review received, league tier up, SP earned, new follower, system announcement
    - Each notification: icon, title, description, timestamp, tap action (navigate to relevant page)
    - "Mark all as read" at top

#### Body (scrollable)

**A. Continue Learning Section**

- Title: "Continue Learning" (Slate-900, font-semibold) with "See All →" link on right (Indigo-500)
- Horizontal scrollable row of cards (`flex overflow-x-auto gap-3 px-4 scrollbar-hide`)
- Each card (`w-[260px] shrink-0`):
  - White bg, rounded-xl, soft shadow
  - Course/coach name (font-medium)
  - Skill icon or coach avatar (32px, rounded-full)
  - Progress bar: `bg-slate-100 rounded-full h-1.5`, fill with Indigo gradient, shows percentage
  - Next session date (small, Slate-500)
- **Empty state:** If no active learning, show:
  - Illustration icon (book with sparkles, or Lucide `BookOpen`)
  - "Start your learning journey!" text (Slate-500)
  - "Browse Coaches" button (orange, rounded-full)

**B. Learn Section (Courses)**

- Title: "Learn" (Slate-900, font-semibold) with a book icon
- **Filter chips row** (horizontal scrollable): "All" | "Free" | "Paid" | "Trending"
  - Active chip: Indigo bg, white text, `rounded-full px-4 py-1.5`
  - Inactive chip: Slate-100 bg, Slate-600 text
- **Featured banner** (if any featured course exists):
  - Wide card spanning full width, `rounded-xl overflow-hidden`
  - Course thumbnail with gradient overlay (dark bottom fade for text readability)
  - "Featured" gold badge in top-left corner
  - Course title + coach name overlay on the image
  - Tap → course detail page
- **Course cards grid** (2 columns on mobile, 3 on tablet):
  - Each card:
    - Thumbnail image (`aspect-video rounded-t-xl`)
    - Course title (font-medium, 2-line clamp)
    - Coach avatar (24px) + coach name (small, Slate-500)
    - Rating: star icon + number (e.g., "4.8")
    - Enrolled count: "234 learners" (small, Slate-400)
    - Price badge: "Free" (Emerald badge) OR SP coin icon + cost (e.g., "50 SP") in orange badge
    - "Premium" gold badge on paid courses (top-right of thumbnail)
- **Ad placement:** Every 4th card position, insert a native ad card:
  - Styled as a regular card but with a small "Sponsored" label (Slate-400, text-xs, top-right)
  - Ad content related to education/skills (Google Courses, academic tools, etc.)
  - AdSense placeholder — do NOT reward SP for viewing/clicking ads
- **Course detail page** (navigated on card tap):
  - Course thumbnail (large, hero-style)
  - Course title, description (full text)
  - Coach mini-profile: avatar, name, rating, total sessions
  - Curriculum/lesson list (expandable sections)
  - Total duration, total enrolled, average rating with star display
  - "Enroll" button (orange, full-width, rounded-full, sticky at bottom)
  - If free: button text "Enroll for Free", no SP cost
  - If paid: button text "Enroll — {cost} SP", deducts SP on tap
  - Related courses at bottom (horizontal scroll)

---

### 2. COACH SECTION (Discover)

#### Header (sticky at top)

- **Left:** Search bar
  - Style: Same as Home search bar
  - Placeholder: "Search coaches, skills..."
  - On focus: Shows recent searches + trending skills (same as Home search behavior)
- **Right:** Filter icon (Lucide: `SlidersHorizontal`)
  - Tap → opens filter bottom sheet with:
    - **Sort by:** Top Rated, Most Sessions, Newest, SP: Low to High, SP: High to Low
    - **Skill category:** multi-select chips (Design, Coding, Music, Art, Languages, Photography, Video Editing, Gaming, Fitness, Others)
    - **League tier:** multi-select (Starter, Learner, Skilled, Pro, Expert, Master)
    - **Availability:** Toggle (online now only)
    - **Min rating:** Slider (1–5 stars)
    - "Apply Filters" and "Reset" buttons at bottom

#### Body

**A. Skill Categories (horizontal scrollable pills)**

- Full-width row, horizontal scroll, `gap-2 px-4`
- Chips: "All", "Design", "Coding", "Music", "Art", "Languages", "Photography", "Video Editing", "Gaming", "Fitness", "Others"
- Active chip: Indigo bg, white text, `rounded-full px-4 py-2 font-medium`
- Inactive chip: `bg-slate-100 text-slate-600 rounded-full px-4 py-2`
- Tapping a chip filters the coach list below immediately

**B. Coach List (Instagram-style user discovery)**

- Vertical scrollable list of coach cards
- **Zero-state (no search, no filter):** Show "Popular Coaches" — the 10 highest-rated coaches on the platform
- **Zero-state (search with no results):** "No coaches found for '{query}'. Try different keywords."
- Each coach card (full-width row, `py-3 px-4 border-b border-slate-100`):
  - **Avatar:** 48px, rounded-full, with online status dot (green `bg-emerald-400` if online, hidden if offline)
  - **Name area** (to the right of avatar):
    - Display name (font-semibold, Slate-900)
    - Username (`@username`, Slate-500, text-sm)
    - League tier badge: small colored pill next to name
      - Starter = `bg-slate-200 text-slate-600` (grey)
      - Learner = `bg-blue-100 text-blue-600` (blue)
      - Skilled = `bg-emerald-100 text-emerald-600` (green)
      - Pro = `bg-purple-100 text-purple-600` (purple)
      - Expert = `bg-amber-100 text-amber-600` (gold)
      - Master = `bg-cyan-100 text-cyan-600` (diamond)
  - **Skill tags:** 2–3 rounded-full small pills below the name, Indigo-tinted bg (`bg-indigo-50 text-indigo-600 text-xs`)
  - **Meta row:** Rating (star icon + number, e.g., "4.8") + total sessions count (e.g., "47 sessions") — Slate-400, text-sm
  - **"Book Session" button:** Small, orange, rounded-full, `text-sm`, positioned at far right of the card row
- **Card interactions:**
  - Tap anywhere on card (except the Book button) → opens Coach Profile (full page)
  - Tap "Book Session" → opens Booking Sheet (see Session Booking Flow section)

**C. Coach Profile Page (full page, navigated from card tap)**

- **Cover image:** Full width, `h-[160px]`, default gradient if none uploaded, `rounded-b-2xl`
- **Avatar:** 80px, rounded-full, overlapping cover/body boundary (negative top margin), white border ring
- **Name + Username:** Same as card but larger
- **League badge:** Larger version with tier icon
- **Role badge:** "Coach" (Gold badge with `GraduationCap` icon) if user is a verified coach, otherwise "Student" (Indigo badge with `BookOpen` icon)
- **Bio:** 2–3 lines, Slate-600
- **Stats row:** 3-column grid showing Sessions Taught | Sessions Learned | Rating
- **"Skills I Teach" section:** Indigo-tinted skill tags
- **"Skills I Want to Learn" section:** Orange-tinted skill tags
- **"Showcase" section:** Grid of video thumbnails (2 columns), max 60 sec each, play icon overlay, tap to play
- **"Reviews" section:** Average rating + list of recent reviews (reviewer avatar, name, stars, text, date). "See All" if more than 3.
- **"Book a Session" CTA:** Sticky orange button at bottom, full width. Tap → Booking Sheet.

---

### 3. MESSENGER SECTION

#### Header (sticky at top)

- **Left:** Search bar
  - Placeholder: "Search conversations..."
  - Filters conversation list in real-time by user name
- **Right:** New message icon (Lucide: `SquarePen` or `PenSquare`)
  - Tap → opens user search overlay to start a new conversation
  - Search overlay: Search bar + user list (similar to Coach list but simplified)
  - Tap user → creates/opens conversation and navigates to Chat Room

#### Body

**A. Conversation List**

- Vertical list of recent conversations
- Each conversation row (`py-3 px-4 border-b border-slate-100`):
  - User avatar: 48px, rounded-full
  - User display name: font-semibold, Slate-900
  - Last message preview: 1 line, truncated with ellipsis, Slate-500, text-sm
  - Timestamp: right-aligned, Slate-400, text-xs (e.g., "2m", "1h", "Yesterday")
  - Unread count badge: red circle with white number (top-right of avatar), hidden if 0
  - Online indicator: green dot on avatar
- Tap conversation → opens Chat Room
- **Empty state:** "No conversations yet. Browse coaches and start chatting!"

**B. Chat Room (conversation detail page)**

- **Top bar (sticky):**
  - Back arrow (left)
  - User name + online/offline status text (center)
  - Call buttons row (right):
    - Voice call icon (Lucide: `Phone`)
    - Video call icon (Lucide: `Video`)
    - Screen share icon (Lucide: `MonitorUp`) — active only during a call
- **Message area (scrollable, flex-grow):**
  - Date separators: centered, `bg-slate-100 rounded-full px-3 py-1 text-xs text-slate-500` (e.g., "Today", "Yesterday")
  - Sent messages (current user):
    - Right-aligned
    - `bg-indigo-500 text-white rounded-tl-xl rounded-br-xl rounded-bl-xl px-3 py-2 max-w-[75%]`
  - Received messages (other user):
    - Left-aligned
    - `bg-slate-100 text-slate-800 rounded-tr-xl rounded-br-xl rounded-bl-xl px-3 py-2 max-w-[75%]`
  - Timestamps: tiny text below each message bubble, Slate-400
  - System messages: centered, Slate-400, italic (e.g., "Session booked for tomorrow 5 PM")
  - Auto-scroll to bottom on new message
- **Input bar (sticky at bottom):**
  - Attachment button (Lucide: `Paperclip`) — for images/files (Cloudinary upload)
  - Text input: `rounded-full bg-slate-100 px-4 py-2.5 flex-grow`, auto-grow textarea
  - Send button: Circle with `ArrowUp` icon, Indigo when text entered, Slate-300 when empty
- **Jitsi Meet integration for calls:**
  - Voice or Video call tap → generates unique Jitsi room: `skillswap-{userId1}-{userId2}-{timestamp}`
  - Opens Jitsi Meet in a fullscreen modal overlay (iframe)
  - Overlay has: Jitsi iframe (full screen), end call button (red, bottom-center, large)
  - Screen share available within Jitsi (built-in feature)
  - End call → closes overlay, returns to chat, sends system message "Call ended — {duration}"

---

### 4. LEADERBOARD SECTION

#### Header

- No traditional header. Section title integrated into the body.

#### Body

**A. Tab Filters (top of section)**

- Horizontal pill tabs: "Weekly" | "Monthly" | "All Time"
- Active tab: Indigo bg, white text, `rounded-full`
- Inactive tab: Slate-100 bg, Slate-600 text
- Default: "Weekly"

**B. Top 3 Podium (hero section)**

```
      ┌─────────┐        ┌─────────┐        ┌─────────┐
      │  2nd     │        │  1st     │        │  3rd     │
      │ (Silver) │        │ (Gold)   │        │ (Bronze) │
      │  Avatar  │        │  Avatar  │        │  Avatar  │
      │  Name    │        │  Name    │        │  Name    │
      │  Points  │        │  Points  │        │  Points  │
      │  Tier    │        │  Tier    │        │  Tier    │
      └────┬─────┘        └────┬─────┘        └────┬─────┘
           │                    │                    │
         ┌─┴─┐               ┌──┴──┐              ┌─┴─┐
         │   │               │     │              │   │
         └───┘               └─────┘              └───┘
        (medium)            (tallest)            (short)
```

- **1st place (center):**
  - Tallest podium bar (180px), gold gradient (`bg-gradient-to-t from-amber-300 to-amber-100`)
  - Crown icon above avatar (Lucide: `Crown`, amber-500)
  - Avatar: 72px, rounded-full, gold ring border (`ring-4 ring-amber-300`)
  - Subtle glow/shadow: `shadow-[0_0_20px_rgba(251,191,36,0.3)]`
  - Name, league tier badge, points, sessions taught below
- **2nd place (left):**
  - Medium podium bar (140px), silver gradient (`bg-gradient-to-t from-slate-300 to-slate-100`)
  - Medal icon above avatar (Lucide: `Medal`, slate-400)
  - Avatar: 60px, rounded-full, silver ring border
  - Name, tier, points below
- **3rd place (right):**
  - Shortest podium bar (110px), bronze gradient (`bg-gradient-to-t from-orange-300 to-orange-100`)
  - Medal icon above avatar (Lucide: `Medal`, orange-400)
  - Avatar: 60px, rounded-full, bronze ring border
  - Name, tier, points below
- Subtle confetti/sparkle animation around 1st place (CSS animation, lightweight)

**C. Remaining Rankings List**

- Below the podium, a clean numbered list from rank 4 onwards
- Each row (`py-3 px-4 flex items-center gap-3 border-b border-slate-50`):
  - Rank number (Slate-400, font-medium, `w-8 text-center`)
  - Avatar (36px, rounded-full)
  - Name (Slate-900, font-medium)
  - League tier badge (small, inline)
  - Points (right-aligned, Slate-500)
- **Current user highlight:** If the logged-in user appears in the list (and is NOT in top 3), their row gets: `bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg` — visually distinct so they can find themselves
- If current user is in top 3, their podium card gets a subtle "You" badge
- **Empty state:** "No rankings yet. Start teaching and learning to climb the leaderboard!"

---

### 5. PROFILE & ACCOUNT SECTION

#### Header (sticky at top)

- **Right side, horizontal icon group:**
  - **SP (Skill Points) display:**
    - Coin icon (Lucide: `Coins` or `Sparkles`) + balance number (e.g., "250 SP")
    - Styled as a tappable pill: `bg-amber-50 text-amber-700 rounded-full px-3 py-1.5 font-medium text-sm`
    - Tap → opens Coin Wallet page:
      - Current SP balance (large display)
      - Transaction history (list: type, amount, reason, timestamp, + or - color coded)
      - "Earn SP" section: list of ways to earn with amounts
      - "Spend SP" section: what you can buy with SP
      - **No buy/withdraw in V1** — internal currency only
  - **Settings gear icon** (Lucide: `Settings`):
    - Tap → opens Settings page:
      - Edit Profile (name, bio, avatar, cover image, username)
      - Manage Skills (add/remove skills you teach and want to learn)
      - Account (email, linked Google account)
      - Notification Preferences (toggle types)
      - Privacy (who can see profile, who can message)
      - Help & Support (FAQ link, contact us)
      - About (version, team credits)
      - Log Out (red text, confirmation dialog)

#### Body (scrollable)

**A. Profile Header Card**

- **Cover image:** Full width, `h-[140px]`, rounded-b-2xl
  - Default: gradient from Indigo-400 to Purple-500 if no cover uploaded
  - Edit: camera icon overlay on hover/tap to upload new cover
- **Avatar:** 80px, rounded-full, positioned overlapping cover/body (negative top margin `mt-[-40px]`), white border ring (`ring-4 ring-white`)
  - Edit: camera icon overlay to change profile picture
- **Name:** Display name, font-bold, `text-xl`, Slate-900
- **Username:** `@username` (unique), Slate-500, `text-sm`
  - Tap → copies username to clipboard with toast "Username copied!"
- **Role badge:** Next to name
  - "Student" → `bg-indigo-100 text-indigo-700` pill with `BookOpen` icon
  - "Coach" → `bg-amber-100 text-amber-700` pill with `GraduationCap` icon (only after Coach Upgrade Flow completed)
- **Bio:** 1–2 lines, Slate-600, `text-sm`

**B. Stats Row**

- Horizontal 3-column grid, `gap-2 px-4`
- Each stat in a mini card: `bg-white rounded-xl p-3 text-center shadow-sm`
  - Sessions Taught: number + label
  - Sessions Learned: number + label
  - Rating: star icon + number

**C. League & Progress**

- Card: `bg-white rounded-xl p-4 shadow-sm`
- Current tier badge (large, with icon and tier name, colored per tier)
- XP progress bar: `bg-slate-100 rounded-full h-3`, fill with gradient (`bg-gradient-to-r from-indigo-400 to-emerald-400`), animated width
- XP text: "450 / 800 XP" (current / next tier)
- Next tier: "→ Skilled" text at end of bar, Slate-400
- Tap card → opens League Detail page:
  - Visual ladder showing all 6 tiers (Starter → Learner → Skilled → Pro → Expert → Master)
  - Current tier highlighted
  - Each tier shows: name, XP required, privileges unlocked
  - User's current XP and progress

**D. Skill Badges Section**

- Title: "Skills" (font-semibold)
- Two subsections:
  - **"I Teach"** — skill tags in Indigo-tinted pills: `bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-sm`
    - Each tag with a small skill icon (e.g., "🎨 Photoshop", "💻 Python", "🎸 Guitar")
    - Tap → navigates to Coach search filtered by that skill
  - **"I Want to Learn"** — skill tags in Orange-tinted pills: `bg-orange-50 text-orange-600 rounded-full px-3 py-1 text-sm`
    - Tap → navigates to Coach search filtered by that skill
- Edit button (pencil icon) on profile owner's view only

**E. Skill Showcase Section**

- Title: "Showcase" with edit button (camera icon, profile owner only)
- Grid of video thumbnails: `grid grid-cols-2 gap-2`
- Each video card:
  - Thumbnail image, `aspect-video rounded-xl`
  - Play icon overlay (centered, semi-transparent white circle with play triangle)
  - Title below (text-sm, Slate-700, 1-line clamp)
  - Duration (text-xs, Slate-400)
- Max 60 seconds per video, uploaded via Cloudinary
- Tap → plays video in fullscreen modal or expand overlay
- Empty state: "No showcase videos yet. Show off your skills!"

**F. Reviews Section**

- Title: "Reviews" with average rating (star display + number, e.g., "4.8 (23 reviews)")
- List of recent reviews (max 3 visible, "See All →" if more):
  - Reviewer avatar (32px, rounded-full) + name
  - Star rating display
  - Review text
  - Date (relative: "2 days ago")
- Empty state: "No reviews yet. Complete sessions to receive reviews!"

---

## Landing Page (Before Login)

A single-page marketing landing shown to non-authenticated visitors:

- **Hero section:**
  - App logo + "SkillSwap" title
  - Tagline: "Teach what you know. Learn what you want."
  - Subtitle: "No money needed. Swap skills with real people. Your knowledge is your currency."
  - Two CTAs: "Get Started" (orange, large, → sign-up) and "Learn More" (secondary, → scrolls to features)
- **How It Works section** (3 steps with icons):
  1. "List Your Skills" — Tell us what you can teach
  2. "Find a Coach" — Browse and connect with skill coaches
  3. "Start Learning" — Book sessions, video call, level up
- **Features section** (grid of 4-6 feature cards):
  - Free Learning (no money needed)
  - Video Sessions (face-to-face teaching)
  - Skill Points (earn by teaching, spend on learning)
  - Leaderboard (compete and climb ranks)
  - Verified Coaches (quality you can trust)
- **Footer:** Minimal — "Built with ♥ by SkillSwap Team" + social/email links

---

## Onboarding Flow (After Sign-Up)

A 3-step onboarding shown ONLY to new users (one-time, after Google OAuth sign-up):

**Step 1: Welcome**
- Friendly illustration + "Welcome to SkillSwap, {name}!"
- Brief explanation: "Here you can teach skills you know and learn skills you've always wanted to. Let's set up your profile."
- "Next" button (orange, full-width)

**Step 2: What Do You Teach?**
- Title: "What skills can you teach?"
- Input field: Type skill name, press Enter/add to add as a tag
- Suggested skills shown as quick-add chips: "Design", "Coding", "Guitar", "Photography", "Video Editing", "Fitness", "Languages"
- Added skills appear as removable tags below
- Minimum 1 skill required, "Skip for now" link available
- "Next" button

**Step 3: What Do You Want to Learn?**
- Title: "What do you want to learn?"
- Same input + chips UI as Step 2 but for learning goals
- "Skip for now" available
- "Done" button → navigates to Home dashboard

---

## Session Booking Flow

### Coach Side: Setting Availability

- In coach profile or settings, a "Set Availability" option
- Opens a weekly calendar view (Mon–Sun)
- For each day, coach can add time slots (start time + end time)
- Slots are recurring weekly (auto-repeats until manually changed)
- Coach can set SP price per session (default: system suggested, editable for Skilled+ tier)
- Available slots are visible to learners on the coach's profile

### Learner Side: Booking

1. Learner taps "Book Session" on coach profile or coach card
2. **Booking Sheet** (bottom sheet) opens:
   - Coach mini-profile (avatar, name, rating)
   - Skill being learned
   - Calendar date picker (available dates highlighted in Indigo)
   - Available time slots for selected date (as selectable pills)
   - SP cost displayed clearly
   - "Confirm Booking" button (orange)
3. On confirm:
   - SP deducted from learner's balance immediately (deposit)
   - Coach receives a notification: "New session request from {learner name}"
   - Session status: PENDING

### Coach Response

- Coach sees pending request in notifications → taps → opens session detail
- **Options:**
  - **Accept** → session status becomes CONFIRMED → Jitsi room link generated → both users notified with link and time
  - **Decline** → session status CANCELLED → SP refunded to learner → both notified
  - **No response within 2 hours** → auto-decline → SP refunded
- On confirmation, system message sent to both users' chat: "Session confirmed: {skill} on {date} at {time}. Join: {Jitsi link}"

### Session Execution

- 5 minutes before session: push notification (in-app) reminder to both
- At session time: either user can tap the Jitsi link to start the call
- Jitsi room opens in fullscreen overlay (same as Messenger call)
- Both users can use video, voice, and screen share within Jitsi

### Post-Session

- Session ends when either user clicks "End Session" or after the scheduled duration
- Both users are prompted to rate each other (1–5 stars + optional comment)
- Rating is mandatory to complete the session flow
- On rating completion:
  - SP credited to coach (the amount set as session price)
  - XP awarded to both (+10 each)
  - Session count incremented for both
  - Coach's average rating recalculated

### Cancel / Reschedule Rules

| Action | Timing | SP Refund |
|--------|--------|-----------|
| Cancel (any party) | 6+ hours before session | 100% refund |
| Cancel (any party) | Less than 6 hours before | 50% refund (penalty) |
| No-show (any party) | Session time passes, no join | 0% refund (learner) / SP penalty (coach) |
| Reschedule | Both parties agree | 100% refund, rebook new slot |

- Report option available if: coach didn't show, inappropriate behavior, fake profile
- 3 reports on a user = temporary account freeze (manual review by you)

---

## League System

### Tiers & Requirements

| Tier | XP Required | Badge Color | Privileges Unlocked |
|------|------------|-------------|---------------------|
| Starter | 0 | Grey (`bg-slate-200 text-slate-600`) | Basic access: book sessions, chat, browse |
| Learner | 200 | Blue (`bg-blue-100 text-blue-600`) | + Upload showcase videos, create free courses |
| Skilled | 800 | Green (`bg-emerald-100 text-emerald-600`) | + Set custom SP prices, priority in search results |
| Pro | 2,000 | Purple (`bg-purple-100 text-purple-600`) | + Create premium (paid) courses, featured badge |
| Expert | 5,000 | Gold (`bg-amber-100 text-amber-700`) | + Coin withdrawal to real money (V2), "Expert" verified badge, donate button (V2) |
| Master | 10,000 | Diamond (`bg-cyan-100 text-cyan-600`) | + Profile spotlight on Home page, revenue share from courses (V2) |

### XP Earning Rates

| Action | XP Earned |
|--------|-----------|
| Complete a session (teaching or learning) | +10 |
| Write a review | +5 |
| Maintain daily streak | +3/day |
| Create a featured course | +20 |
| Monthly leaderboard top 10 | +50 |
| Refer a friend (friend completes first session) | +30 |

### League Tier Downgrade

- XP never decreases. Tier is permanent once achieved.
- However, "active tier" (for privileges like priority listing) requires maintaining a minimum of 2 sessions per month. Inactive for 30 days = displayed as previous tier until reactivated.

---

## Coach Upgrade Flow

Not every user starts as a Coach. The role upgrade is earned:

### Requirements to Become Coach

1. Complete at least **3 teaching sessions** (sessions where you were the coach)
2. Maintain a minimum average rating of **4.0** from reviews received
3. Have at least **1 skill listed** in "Skills I Teach"

### Upgrade Trigger

- After a user completes their 3rd teaching session with 4.0+ rating → system triggers an upgrade prompt
- Modal/overlay appears: "Congratulations! You're eligible to become a Verified Coach! Coaches get: custom session pricing, course creation, and priority in search results. Upgrade now?"
- User taps "Upgrade" → role changes from STUDENT to COACH → Coach badge appears on profile → privileges unlocked

### Coach-Specific Privileges

- Custom SP pricing for sessions (Starter/Learner users have system-fixed pricing)
- Create and publish courses (free and premium)
- Priority listing in Coach search results (appear above non-coaches)
- "Verified Coach" badge on profile and cards
- Coach-specific analytics (total sessions, earnings, average rating)

---

## Skill Points (SP) Economy — V1 (Internal Only)

### Earning SP

| Method | SP Earned |
|--------|-----------|
| Teach a session (coach sets price, 10–50 SP default) | 10–50 SP |
| Complete daily streak tasks | 3–15 SP per task |
| Refer a friend (friend joins + completes first session) | 20 SP |
| Complete profile (avatar, bio, skills) | One-time 10 SP |
| First session (as learner) | One-time 10 SP |
| Write a review after session | 5 SP |

### Spending SP

| Method | SP Cost |
|--------|---------|
| Book a session (set by coach or system) | 10–50 SP |
| Enroll in a premium course | Set by course creator (50–500 SP) |

### Important V1 Rules

- **SP is internal-only.** No real money in, no real money out in V1.
- New users start with **50 SP** (welcome bonus) — enough to book 2–3 free sessions.
- SP balance is displayed on Profile header and Coin Wallet page.
- SP transactions are logged in the `CoinTransaction` table with type (EARNED, SPENT) and reason.
- Razorpay integration (buy SP with real money, withdraw SP to bank) is **V2 only**.

---

## Daily Tasks & Streaks

### Daily Tasks (refresh every 24 hours)

| Task | SP Reward | Condition |
|------|-----------|-----------|
| Teach a session | +15 SP | Complete at least 1 teaching session today |
| Learn something | +10 SP | Complete at least 1 learning session today |
| Write a review | +5 SP | Write a review for a completed session |
| Share your profile | +3 SP | Tap share button (generates profile link) |
| Log in daily | +2 SP | Just open the app (streak contribution) |

### Streak System

- **Day streak** counter on Profile and Dashboard
- Fire icon (Lucide: `Flame`) + streak number (e.g., "🔥 7")
- Streak increases by 1 for each consecutive day the user opens the app and completes at least 1 task
- **Streak break:** If a user misses a full day (no activity), streak resets to 0
- **Streak milestones:** 7 days (+20 SP bonus), 14 days (+30 SP bonus), 30 days (+50 SP bonus)
- **Streak warning:** At 11 PM, if user hasn't completed a task today, show a notification: "Complete a task to keep your {n} day streak alive!"

---

## Course System

### Course Types

**Free Courses:**
- Created by any Learner+ tier user
- No SP cost to enroll
- Coach earns XP + recognition (no SP)

**Premium Courses:**
- Created by Pro+ tier users only
- Costs SP to enroll (set by creator, 50–500 SP range)
- When a learner enrolls: SP deducted from learner, credited to course creator
- Course creator earns XP for each enrollment

### Course Structure

- **Course:** Title, description, thumbnail, category, coach, lessons, enrollment count, average rating
- **Lesson:** Title, content (text + optional video URL), duration, order
- First lesson of any course can be marked as "Free Preview" — viewable without enrollment

### Course Creation Flow (Coach/Pro+)

1. Coach taps "Create Course" (available in Profile or a dedicated "My Courses" page)
2. Fill in: Title, description, category (from predefined list), thumbnail (upload to Cloudinary)
3. Set: Free or Premium (if Pro+, can set SP price)
4. Add lessons: Title, text content, optional video URL, duration, order
5. Mark first lesson as free preview (optional)
6. Publish → course goes live, appears in Home → Learn section
7. Coach can edit/unpublish/delete their own courses from "My Courses"

---

## Notification System

### Notification Types

| Type | Trigger | Action on Tap |
|------|---------|---------------|
| Session Request | Learner books a session with you | Open session detail → Accept/Decline |
| Session Confirmed | Coach confirms your booking | Show Jitsi link + time |
| Session Reminder | 5 minutes before session | Open Jitsi room |
| New Message | Someone sends you a message | Open Chat Room |
| Review Received | Someone rates you after a session | Open your reviews |
| League Up | You reached a new league tier | Open League Detail page |
| SP Earned | You earned Skill Points | Open Coin Wallet |
| Coach Eligible | You meet Coach upgrade requirements | Open upgrade modal |
| New Follower | Someone started following you | Open their profile |
| System | Announcements, updates | Open notification detail |

### Delivery

- **Real-time:** Socket.io pushes notification immediately
- **History:** Stored in DB, viewable in Notification panel (Home → Bell icon)
- **In-app only for V1** — no push notifications (V2)
- Unread count badge on Bell icon and Chat tab

---

## Report System (Basic)

### Report Flow

1. On any user profile or after a session, a "Report" option (flag icon, subtle)
2. Tap → opens bottom sheet with:
   - Reason dropdown: "Inappropriate behavior", "No-show", "Fake profile", "Harassment", "Spam", "Other"
   - Optional text description (max 500 chars)
   - "Submit Report" button
3. On submit: stored in DB, NO notification to reported user
4. **Manual review:** You (admin) check reports from database and take action
5. **3 reports on same user** → account temporarily frozen (cannot book/teach/chat until you review)

---

## Empty States

Every list, section, and feature should have a friendly empty state:

| Section | Illustration/Icon | Message | CTA Button |
|---------|-------------------|---------|------------|
| Continue Learning | `BookOpen` | "Start your learning journey!" | "Browse Coaches" |
| Learn/Courses | `GraduationCap` | "No courses yet. Coaches are creating them!" | "Browse Coaches" |
| Coach Search (no results) | `SearchX` | "No coaches found for '{query}'" | "Clear Search" |
| Messenger | `MessageCircle` | "No conversations yet" | "Find a Coach" |
| Leaderboard | `Trophy` | "No rankings yet. Start teaching!" | "Go to Home" |
| Reviews | `Star` | "No reviews yet" | — |
| Showcase Videos | `Video` | "No showcase videos yet" | "Add Video" |
| Notifications | `BellOff` | "All caught up! No notifications" | — |

- Use Lucide icons as illustrations (large size, Slate-300 color)
- Add subtle CSS animation to empty state icons (gentle float or pulse) to make them feel alive
- Messages should be encouraging, not discouraging

---

## Ad Placement (V1)

| Location | Ad Type | Style |
|----------|---------|-------|
| Home → Learn section | Native card (every 4th card) | Regular card size, "Sponsored" label, education-related |
| Course Detail page bottom | Banner ad | Full-width banner, subtle, "Sponsored" label |

### Critical AdSense Rules

- **Do NOT reward SP for viewing or clicking ads.** This violates Google AdSense Terms of Service and will get your account banned.
- Ads are **passive income only** — displayed naturally alongside content.
- Use AdSense responsive ad units.
- No deceptive ad placement (ads must not look like regular content buttons).

---

## Database Schema (Prisma Models)

```prisma
// ==================== ENUMS ====================

enum Role {
  STUDENT
  COACH
}

enum Tier {
  STARTER
  LEARNER
  SKILLED
  PRO
  EXPERT
  MASTER
}

enum SessionStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum TransactionType {
  EARNED
  SPENT
}

enum MessageType {
  TEXT
  IMAGE
  FILE
  SYSTEM
}

// ==================== USER ====================

model User {
  id                     String    @id @default(cuid())
  name                   String
  username               String    @unique
  email                  String    @unique
  image                  String?
  coverImage             String?
  bio                    String?
  role                   Role      @default(STUDENT)
  leagueTier             Tier      @default(STARTER)
  xp                     Int       @default(0)
  sp                     Int       @default(50)  // Skill Points, welcome bonus
  streak                 Int       @default(0)
  lastActiveAt           DateTime?
  totalSessionsTaught    Int       @default(0)
  totalSessionsLearned   Int       @default(0)
  averageRating          Float     @default(0)
  onboardingCompleted    Boolean   @default(false)
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt

  skillsTeach            SkillTeach[]
  skillsLearn            SkillLearn[]
  sessionsGiven          Session[]             @relation("SessionsGiven")
  sessionsTaken          Session[]             @relation("SessionsTaken")
  reviewsReceived        Review[]              @relation("ReviewsReceived")
  reviewsWritten         Review[]              @relation("ReviewsWritten")
  coinTransactions       CoinTransaction[]
  messages               Message[]
  conversations          ConversationParticipant[]
  coursesCreated         Course[]
  courseEnrollments      CourseEnrollment[]
  reports                Report[]              @relation("ReportsFiled")
  reportsAgainst         Report[]              @relation("ReportsAgainst")
  availabilitySlots      AvailabilitySlot[]
}

// ==================== SKILLS ====================

model SkillTeach {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  skillName String
  category  String?
  createdAt DateTime @default(now())
}

model SkillLearn {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  skillName String
  category  String?
  createdAt DateTime @default(now())
}

// ==================== SESSIONS ====================

model Session {
  id            String        @id @default(cuid())
  coachId       String
  coach         User          @relation("SessionsGiven", fields: [coachId], references: [id])
  learnerId     String
  learner       User          @relation("SessionsTaken", fields: [learnerId], references: [id])
  skillName     String
  status        SessionStatus @default(PENDING)
  scheduledAt   DateTime
  durationMins  Int           @default(60)
  spCost        Int
  jitsiRoomUrl  String?
  notes         String?
  cancelledBy   String?
  cancelReason  String?
  coachRated    Boolean       @default(false)
  learnerRated  Boolean       @default(false)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  reviews       Review[]
}

// ==================== REVIEWS ====================

model Review {
  id         String   @id @default(cuid())
  sessionId  String
  session    Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  reviewerId String
  reviewer   User     @relation("ReviewsWritten", fields: [reviewerId], references: [id])
  revieweeId String
  reviewee   User     @relation("ReviewsReceived", fields: [revieweeId], references: [id])
  rating     Int      // 1-5
  comment    String?
  createdAt  DateTime @default(now())
}

// ==================== COIN/SP TRANSACTIONS ====================

model CoinTransaction {
  id        String          @id @default(cuid())
  userId    String
  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      TransactionType // EARNED or SPENT
  amount    Int             // positive number
  reason    String          // "Completed session: Guitar", "Enrolled in: Photoshop Basics", etc.
  createdAt DateTime        @default(now())
}

// ==================== CONVERSATIONS & MESSAGES ====================

model Conversation {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  participants ConversationParticipant[]
  messages    Message[]
}

model ConversationParticipant {
  id             String        @id @default(cuid())
  conversationId String
  conversation   Conversation  @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  userId         String
  user           User          @relation(fields: [userId], references: [id])
  lastReadAt     DateTime?
}

model Message {
  id             String      @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId       String
  content        String?
  messageType    MessageType @default(TEXT)
  isRead         Boolean     @default(false)
  createdAt      DateTime    @default(now())
}

// ==================== COURSES ====================

model Course {
  id             String   @id @default(cuid())
  coachId        String
  coach          User     @relation(fields: [coachId], references: [id])
  title          String
  description    String
  thumbnail      String?
  category       String
  isFree         Boolean  @default(true)
  spPrice        Int?     // null if free
  totalLessons   Int      @default(0)
  totalEnrolled  Int      @default(0)
  averageRating  Float    @default(0)
  isPublished    Boolean  @default(false)
  isFeatured     Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  enrollments    CourseEnrollment[]
  lessons        Lesson[]
}

model Lesson {
  id         String  @id @default(cuid())
  courseId   String
  course     Course  @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title      String
  content    String? // text content
  videoUrl   String? // external video URL (YouTube, etc.)
  duration   Int?    // minutes
  order      Int
  isFreePreview Boolean @default(false)
}

model CourseEnrollment {
  id          String    @id @default(cuid())
  courseId    String
  course      Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  progress    Float     @default(0) // percentage 0-100
  completedAt DateTime?
  createdAt   DateTime  @default(now())
}

// ==================== AVAILABILITY ====================

model AvailabilitySlot {
  id        String   @id @default(cuid())
  coachId   String
  coach     User     @relation(fields: [coachId], references: [id], onDelete: Cascade)
  dayOfWeek Int      // 0=Sunday, 1=Monday, ... 6=Saturday
  startTime String   // "10:00" (HH:mm format)
  endTime   String   // "11:00" (HH:mm format)
  isBooked  Boolean  @default(false)
  createdAt DateTime @default(now())
}

// ==================== REPORTS ====================

model Report {
  id              String   @id @default(cuid())
  reporterId      String
  reporter        User     @relation("ReportsFiled", fields: [reporterId], references: [id])
  reportedUserId  String
  reportedUser    User     @relation("ReportsAgainst", fields: [reportedUserId], references: [id])
  reason          String
  description     String?
  status          String   @default("PENDING") // PENDING, REVIEWED, DISMISSED
  createdAt       DateTime @default(now())
  resolvedAt      DateTime?
}
```

---

## PWA Configuration

```json
// public/manifest.json
{
  "name": "SkillSwap",
  "short_name": "SkillSwap",
  "description": "Teach what you know. Learn what you want.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F8FAFC",
  "theme_color": "#4F46E5",
  "orientation": "portrait",
  "categories": ["education", "lifestyle"],
  "icons": [
    {
      "src": "/icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [],
  "shortcuts": [
    {
      "name": "Browse Coaches",
      "url": "/coach",
      "icons": [{"src": "/icons/shortcut-coach.png", "sizes": "96x96"}]
    },
    {
      "name": "Messages",
      "url": "/chat",
      "icons": [{"src": "/icons/shortcut-chat.png", "sizes": "96x96"}]
    }
  ]
}
```

### PWA Meta Tags (in layout.tsx)

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#4F46E5" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="SkillSwap" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

### Service Worker (next-pwa config)

```javascript
// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  // your existing next config
});
```

### Install Prompt

- Show a custom "Add to Home Screen" banner (not the native browser prompt) after the user's 2nd visit
- Banner: friendly card at bottom of screen with app icon, "Install SkillSwap" text, and "Install" / "Not now" buttons
- On install: dismiss banner, show success toast "SkillSwap installed! You can find it on your home screen."

---

## Build Order (Step-by-Step)

Build each phase completely before moving to the next. Test after each phase.

### Phase 1: Foundation (Days 1–4)
1. Initialize Next.js 15 project with TypeScript + Tailwind + shadcn/ui
2. Set up Prisma with PostgreSQL + run all migrations
3. Implement Google OAuth with NextAuth
4. Build the global layout with bottom navigation bar
5. Build Landing Page (hero + how it works + features + CTA)
6. Build Onboarding Flow (3 steps)

### Phase 2: Profiles & Skills (Days 5–8)
7. User profile page (cover, avatar, name, username, bio, stats, league progress, skill badges, showcase, reviews)
8. Add/edit skills (teach + learn) functionality
9. Settings page (edit profile, manage skills, privacy, help, logout)
10. Coin Wallet page (SP balance, transaction history, earn/spend info)
11. Profile editing (name, bio, avatar upload to Cloudinary, cover upload)

### Phase 3: Coach Discovery (Days 9–12)
12. Coach section: skill category chips + coach list
13. Coach search (real-time filtering)
14. Coach card design and interaction
15. Coach profile page (full page with all details)
16. Filter bottom sheet (sort, category, tier, availability, rating)

### Phase 4: Sessions & Booking (Days 13–17)
17. Availability slot system (coach sets weekly slots)
18. Session booking flow (learner selects slot → SP deducted → PENDING)
19. Coach accept/decline flow (with 2-hour auto-decline)
20. Jitsi Meet integration (room generation, iframe overlay, end call)
21. Post-session flow (rating, XP, SP credit)
22. Cancel/reschedule rules implementation
23. Report system (basic)

### Phase 5: Chat & Communication (Days 18–21)
24. Conversation list (messenger section)
25. Chat room UI (message bubbles, input bar, attachments)
26. Socket.io real-time messaging
27. New conversation flow (user search + create)
28. Message read status (read receipts)
29. Call integration from chat (voice/video → Jitsi)

### Phase 6: Points, Ratings & Leaderboard (Days 22–25)
30. SP earning/spending logic (on session complete, course enroll, tasks)
31. Daily tasks system (generate tasks, track completion, claim rewards)
32. Streak system (track daily activity, calculate streak, milestone bonuses)
33. Rating system (post-session rating flow, average calculation)
34. League tier system (XP thresholds, tier calculation, privileges check)
35. Leaderboard page (podium design, tab filters, current user highlight)
36. Coach upgrade flow (3 sessions + 4.0 rating → upgrade prompt)

### Phase 7: Courses (Days 26–28)
37. Course creation flow (coach/pro+ can create)
38. Course listing on Home → Learn section (free + paid + filters + featured banner)
39. Course detail page (info, lessons, enroll button)
40. Course enrollment (SP deduction, progress tracking)
41. AdSense placeholder integration (native ads in course list)

### Phase 8: Polish & PWA (Days 29–32)
42. Notification system (Socket.io real-time + notification panel)
43. All empty states (illustrations + messages + CTAs)
44. PWA configuration (manifest.json, service worker, install prompt)
45. Responsive testing (mobile 375px, tablet 768px, desktop 1024px+)
46. Performance optimization (lazy loading, image optimization, code splitting)
47. Final testing of all flows end-to-end
48. Deploy to Vercel

---

## Critical Reminders

1. **SP (Skill Points) is the ONLY currency name.** Never call it "coins" or "Aether" or anything else. Consistency matters.

2. **AdSense TOS:** NEVER reward users for viewing or clicking ads. SP is earned through actions (teaching, learning, tasks, streaks) ONLY.

3. **No real money in V1.** SP is internal-only. No Razorpay, no withdrawals, no purchases with real money.

4. **Mobile-first always.** Design and test on 375px viewport first. Desktop is secondary.

5. **Light theme only in V1.** Do not build dark mode toggle.

6. **Jitsi Meet, not custom video.** Use iframe embed. Do not attempt to build video/voice/screen share from scratch.

7. **Every list needs an empty state.** No blank screens. Ever.

8. **Socket.io for real-time features.** Chat, notifications, leaderboard updates all use WebSocket.

9. **Cloudinary for all file uploads.** Profile pictures, cover images, showcase videos, course thumbnails.

10. **The build order is sacred.** Do not skip phases or jump ahead. Each phase depends on the previous one being complete.
