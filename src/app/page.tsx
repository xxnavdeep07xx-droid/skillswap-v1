'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { LandingPage } from '@/components/landing/LandingPage';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { BottomNav } from '@/components/shared/BottomNav';
import { HomeSection } from '@/components/home/HomeSection';
import { CourseDetailPage } from '@/components/home/CourseDetailPage';
import { CoachSection } from '@/components/coach/CoachSection';
import { CoachProfilePage } from '@/components/coach/CoachProfilePage';
import { BookingSheet } from '@/components/coach/BookingSheet';
import { ChatSection } from '@/components/chat/ChatSection';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { LeaderboardSection } from '@/components/leaderboard/LeaderboardSection';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { SPWalletPage } from '@/components/profile/SPWalletPage';

export default function Home() {
  const {
    isAuthenticated,
    currentUser,
    onboardingStep,
    activeTab,
    viewStack,
  } = useAppStore();

  // Restore user from localStorage on mount
  useEffect(() => {
    const store = useAppStore.getState();
    if (!store.isAuthenticated) {
      try {
        const stored = localStorage.getItem('skillswap_user');
        if (stored) {
          const user = JSON.parse(stored);
          store.login(user);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Not authenticated → Landing
  if (!isAuthenticated || !currentUser) {
    return <LandingPage />;
  }

  // Authenticated but onboarding not complete
  if (onboardingStep >= 0 && !currentUser.onboardingCompleted) {
    return <OnboardingFlow />;
  }

  // Render top of view stack
  const topView = viewStack.length > 0 ? viewStack[viewStack.length - 1] : null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return topView?.type === 'course-detail' ? (
          <CourseDetailPage courseId={topView.data?.courseId as string} />
        ) : (
          <HomeSection />
        );
      case 'coach':
        if (topView?.type === 'booking') {
          return <BookingSheet coachId={topView.data?.coachId as string} />;
        }
        if (topView?.type === 'coach-profile') {
          return <CoachProfilePage coachId={topView.data?.coachId as string} />;
        }
        return <CoachSection />;
      case 'chat':
        return topView?.type === 'chat-room' ? (
          <ChatRoom
            conversationId={topView.data?.conversationId as string}
            userId={topView.data?.userId as string}
            userName={topView.data?.userName as string}
            userImage={topView.data?.userImage as string | null}
          />
        ) : (
          <ChatSection />
        );
      case 'board':
        return <LeaderboardSection />;
      case 'profile':
        return topView?.type === 'sp-wallet' ? (
          <SPWalletPage />
        ) : topView?.type === 'settings' ? (
          <ProfileSection />
        ) : (
          <ProfileSection />
        );
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div key={`${activeTab}-${topView?.id ?? 'base'}`} className="pb-24">
        {renderTabContent()}
      </div>
      <BottomNav />
    </div>
  );
}
