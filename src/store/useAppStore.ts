import { create } from "zustand";

// Types
export type TabId = "home" | "coach" | "chat" | "board" | "profile";

export interface ViewStackEntry {
  id: string;
  type: string;
  data?: Record<string, unknown>;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string | null;
  coverImage: string | null;
  bio: string | null;
  role: "STUDENT" | "COACH";
  leagueTier: "STARTER" | "LEARNER" | "SKILLED" | "PRO" | "EXPERT" | "MASTER";
  xp: number;
  sp: number;
  streak: number;
  lastActiveAt: string | null;
  totalSessionsTaught: number;
  totalSessionsLearned: number;
  averageRating: number;
  onboardingCompleted: boolean;
}

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;

  // Navigation
  activeTab: TabId;
  viewStack: ViewStackEntry[];
  previousTab: TabId | null;

  // UI state
  searchQuery: string;
  showNotifications: boolean;
  showTasks: boolean;
  showFilters: boolean;
  courseFilter: string;

  // Chat
  activeConversationId: string | null;

  // Onboarding
  onboardingStep: number;
  onboardingSkillsTeach: string[];
  onboardingSkillsLearn: string[];

  // Actions
  setActiveTab: (tab: TabId) => void;
  pushView: (type: string, data?: Record<string, unknown>) => void;
  popView: () => void;
  clearViewStack: () => void;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: Partial<User>) => void;
  setSearchQuery: (query: string) => void;
  setShowNotifications: (show: boolean) => void;
  setShowTasks: (show: boolean) => void;
  setShowFilters: (show: boolean) => void;
  setCourseFilter: (filter: string) => void;
  setActiveConversationId: (id: string | null) => void;
  setOnboardingStep: (step: number) => void;
  setOnboardingSkillsTeach: (skills: string[]) => void;
  setOnboardingSkillsLearn: (skills: string[]) => void;
  completeOnboarding: () => void;
}

// Check localStorage for persisted auth
function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("skillswap_user");
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  currentUser: null,
  isAuthenticated: !!getStoredUser(),

  // Navigation
  activeTab: "home",
  viewStack: [],
  previousTab: null,

  // UI
  searchQuery: "",
  showNotifications: false,
  showTasks: false,
  showFilters: false,
  courseFilter: "All",

  // Chat
  activeConversationId: null,

  // Onboarding
  onboardingStep: 0,
  onboardingSkillsTeach: [],
  onboardingSkillsLearn: [],

  // Actions
  setActiveTab: (tab) =>
    set((state) => ({
      activeTab: tab,
      previousTab: state.activeTab,
      viewStack: [],
      showNotifications: false,
      showTasks: false,
      showFilters: false,
      activeConversationId: null,
    })),

  pushView: (type, data) =>
    set((state) => ({
      viewStack: [
        ...state.viewStack,
        { id: `${type}-${Date.now()}`, type, data },
      ],
    })),

  popView: () =>
    set((state) => ({
      viewStack: state.viewStack.slice(0, -1),
    })),

  clearViewStack: () => set({ viewStack: [] }),

  login: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("skillswap_user", JSON.stringify(user));
    }
    set({
      currentUser: user,
      isAuthenticated: true,
      onboardingStep: user.onboardingCompleted ? -1 : 0,
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("skillswap_user");
    }
    set({
      currentUser: null,
      isAuthenticated: false,
      activeTab: "home",
      viewStack: [],
      onboardingStep: 0,
      onboardingSkillsTeach: [],
      onboardingSkillsLearn: [],
    });
  },

  setUser: (updates) =>
    set((state) => {
      const updated = state.currentUser
        ? { ...state.currentUser, ...updates }
        : null;
      if (updated && typeof window !== "undefined") {
        localStorage.setItem("skillswap_user", JSON.stringify(updated));
      }
      return { currentUser: updated };
    }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setShowNotifications: (show) => set({ showNotifications: show }),
  setShowTasks: (show) => set({ showTasks: show }),
  setShowFilters: (show) => set({ showFilters: show }),
  setCourseFilter: (filter) => set({ courseFilter: filter }),
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setOnboardingSkillsTeach: (skills) =>
    set({ onboardingSkillsTeach: skills }),
  setOnboardingSkillsLearn: (skills) =>
    set({ onboardingSkillsLearn: skills }),

  completeOnboarding: () =>
    set((state) => {
      const updated = state.currentUser
        ? { ...state.currentUser, onboardingCompleted: true }
        : null;
      if (updated && typeof window !== "undefined") {
        localStorage.setItem("skillswap_user", JSON.stringify(updated));
      }
      return { currentUser: updated, onboardingStep: -1 };
    }),
}));
