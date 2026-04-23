'use client';

import { useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { demoUser5 } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Repeat,
  Users,
  Zap,
  Star,
  Shield,
  Globe,
  Heart,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

function FadeInWhenVisible({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const steps = [
  {
    icon: Repeat,
    title: 'Share Your Skills',
    description:
      'List skills you can teach and earn Skill Points (SP) when you help others learn.',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: Users,
    title: 'Find Coaches',
    description:
      'Browse skilled coaches, book 1-on-1 sessions, or enroll in self-paced courses.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Zap,
    title: 'Learn & Grow',
    description:
      'Build your streaks, climb the leaderboard, and unlock new leagues as you learn.',
    color: 'bg-emerald-100 text-emerald-600',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Skill Points (SP)',
    description: 'Teach to earn, spend to learn. Your knowledge is the currency.',
  },
  {
    icon: Star,
    title: 'League System',
    description: 'Climb from Starter to Master. Unlock perks at every tier.',
  },
  {
    icon: Shield,
    title: 'Verified Coaches',
    description: 'Every coach is reviewed and rated by the community.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Connect with learners and teachers from around the world.',
  },
];

export function LandingPage() {
  const { login } = useAppStore();
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    login(demoUser5);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ─── Hero ─── */}
      <section className="relative px-5 pt-12 pb-16 max-w-md mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/60 via-purple-100/40 to-orange-100/30 rounded-full blur-3xl -z-10" />

        <FadeInWhenVisible>
          <div className="flex items-center gap-3 mb-8">
            <Image
              src="/images/logo.png"
              alt="SkillSwap"
              width={44}
              height={44}
              className="rounded-xl"
            />
            <span className="text-2xl font-bold gradient-text">SkillSwap</span>
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.1}>
          <h1 className="text-[2rem] leading-tight font-extrabold text-foreground mb-3">
            Teach what you know.{' '}
            <span className="gradient-text">Learn what you want.</span>
          </h1>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.2}>
          <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-sm">
            Swap skills with real people. Your knowledge is your currency. Join
            a community of passionate learners and expert teachers.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleGetStarted}
              className="w-full h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/25"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Button>
            <Button
              onClick={scrollToHowItWorks}
              variant="outline"
              className="w-full h-12 text-base font-medium rounded-xl border-slate-200"
            >
              Learn More
            </Button>
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.4}>
          <div className="mt-10 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-100">
            <Image
              src="/images/hero.png"
              alt="SkillSwap App Preview"
              width={500}
              height={350}
              className="w-full h-auto object-cover"
            />
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15} className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[
                '/images/avatar-coach-1.jpg',
                '/images/avatar-coach-2.jpg',
                '/images/avatar-coach-3.jpg',
                '/images/avatar-coach-4.jpg',
              ].map((img, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                >
                  <Image
                    src={img}
                    alt=""
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-sm text-slate-500">
              <strong className="text-foreground">2,500+</strong> learners
            </span>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ─── How It Works ─── */}
      <section
        ref={howItWorksRef}
        className="px-5 py-16 bg-white max-w-md mx-auto"
      >
        <FadeInWhenVisible className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">
            How It Works
          </Badge>
          <h2 className="text-2xl font-bold text-foreground">
            Three steps to start swapping
          </h2>
        </FadeInWhenVisible>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <FadeInWhenVisible key={i} delay={i * 0.12}>
              <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${step.color}`}
                >
                  <step.icon size={22} />
                </div>
                <div className="pt-0.5">
                  <h3 className="font-semibold text-foreground mb-1">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="px-5 py-16 max-w-md mx-auto">
        <FadeInWhenVisible className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">
            Features
          </Badge>
          <h2 className="text-2xl font-bold text-foreground">
            Everything you need to learn
          </h2>
        </FadeInWhenVisible>

        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, i) => (
            <FadeInWhenVisible key={i} delay={i * 0.08}>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                  <feature.icon size={20} />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-5 py-12 max-w-md mx-auto">
        <FadeInWhenVisible>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-center">
            <div className="absolute inset-0 bg-[url('/images/hero.png')] bg-cover bg-center opacity-10" />
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-white mb-2">
                Ready to start learning?
              </h2>
              <p className="text-indigo-100 text-sm mb-5">
                Join thousands of learners swapping skills every day.
              </p>
              <Button
                onClick={handleGetStarted}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 h-11 font-semibold shadow-lg shadow-orange-500/30"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-5 py-8 text-center max-w-md mx-auto">
        <p className="text-sm text-slate-400">
          Built with <Heart size={14} className="inline text-red-400 fill-red-400" /> by{' '}
          <span className="font-medium text-slate-600">SkillSwap Team</span>
        </p>
      </footer>
    </div>
  );
}
