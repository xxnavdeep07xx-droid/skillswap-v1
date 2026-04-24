'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  SUGGESTED_SKILLS_TEACH,
  SUGGESTED_SKILLS_LEARN,
} from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ArrowRight, Sparkles, GraduationCap, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function OnboardingFlow() {
  const {
    currentUser,
    onboardingStep,
    onboardingSkillsTeach,
    onboardingSkillsLearn,
    setOnboardingStep,
    setOnboardingSkillsTeach,
    setOnboardingSkillsLearn,
    completeOnboarding,
  } = useAppStore();

  const [inputValue, setInputValue] = useState('');

  const firstName = currentUser?.name?.split(' ')[0] ?? 'there';

  const handleAddSkill = () => {
    const skill = inputValue.trim();
    if (!skill) return;
    const set = onboardingStep === 1
      ? onboardingSkillsTeach
      : onboardingSkillsLearn;
    if (set.includes(skill)) {
      setInputValue('');
      return;
    }
    if (onboardingStep === 1) {
      setOnboardingSkillsTeach([...onboardingSkillsTeach, skill]);
    } else {
      setOnboardingSkillsLearn([...onboardingSkillsLearn, skill]);
    }
    setInputValue('');
  };

  const handleRemoveSkill = (skill: string) => {
    if (onboardingStep === 1) {
      setOnboardingSkillsTeach(onboardingSkillsTeach.filter((s) => s !== skill));
    } else {
      setOnboardingSkillsLearn(onboardingSkillsLearn.filter((s) => s !== skill));
    }
  };

  const handleChipToggle = (skill: string) => {
    const current = onboardingStep === 1
      ? onboardingSkillsTeach
      : onboardingSkillsLearn;
    if (current.includes(skill)) {
      handleRemoveSkill(skill);
    } else {
      if (onboardingStep === 1) {
        setOnboardingSkillsTeach([...onboardingSkillsTeach, skill]);
      } else {
        setOnboardingSkillsLearn([...onboardingSkillsLearn, skill]);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const suggestedSkills =
    onboardingStep === 1 ? SUGGESTED_SKILLS_TEACH : SUGGESTED_SKILLS_LEARN;
  const currentSkills =
    onboardingStep === 1 ? onboardingSkillsTeach : onboardingSkillsLearn;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {/* Step 0: Welcome */}
        {onboardingStep === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center justify-center px-8 text-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
              <Sparkles size={40} className="text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome, {firstName}! 🎉
            </h1>
            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-xs">
              Let&apos;s set up your profile so you can start teaching and
              learning on SkillSwap.
            </p>
            <Button
              onClick={() => setOnboardingStep(1)}
              className="w-full max-w-xs h-12 text-base font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700"
            >
              Let&apos;s Go
              <ArrowRight size={18} />
            </Button>
          </motion.div>
        )}

        {/* Step 1: Skills you can teach */}
        {onboardingStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col px-5 pt-12"
          >
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <GraduationCap size={24} />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">
                What skills can you teach?
              </h2>
              <p className="text-sm text-slate-500">
                Add the skills you&apos;re confident teaching to others.
              </p>
            </div>

            {/* Tags */}
            {currentSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2 mb-5">
              <Input
                placeholder="Type a skill..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-11 rounded-xl"
              />
              <Button
                onClick={handleAddSkill}
                size="sm"
                className="h-11 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                Add
              </Button>
            </div>

            {/* Suggested chips */}
            <p className="text-xs font-medium text-slate-400 mb-3">
              SUGGESTED SKILLS
            </p>
            <div className="flex flex-wrap gap-2 mb-auto">
              {suggestedSkills.map((skill) => {
                const isSelected = currentSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => handleChipToggle(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 pb-8">
              <Button
                variant="ghost"
                onClick={() => setOnboardingStep(2)}
                className="text-slate-500"
              >
                Skip
              </Button>
              <Button
                onClick={() => setOnboardingStep(2)}
                className="flex-1 h-12 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                Next
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Skills you want to learn */}
        {onboardingStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col px-5 pt-12"
          >
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
                <BookOpen size={24} />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">
                What do you want to learn?
              </h2>
              <p className="text-sm text-slate-500">
                Add the skills you&apos;d like to pick up.
              </p>
            </div>

            {/* Tags */}
            {currentSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-700"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2 mb-5">
              <Input
                placeholder="Type a skill..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-11 rounded-xl"
              />
              <Button
                onClick={handleAddSkill}
                size="sm"
                className="h-11 px-4 bg-orange-500 hover:bg-orange-600 rounded-xl"
              >
                Add
              </Button>
            </div>

            {/* Suggested chips */}
            <p className="text-xs font-medium text-slate-400 mb-3">
              SUGGESTED SKILLS
            </p>
            <div className="flex flex-wrap gap-2 mb-auto">
              {suggestedSkills.map((skill) => {
                const isSelected = currentSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => handleChipToggle(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 pb-8">
              <Button
                variant="ghost"
                onClick={completeOnboarding}
                className="text-slate-500"
              >
                Skip
              </Button>
              <Button
                onClick={completeOnboarding}
                className="flex-1 h-12 font-semibold rounded-xl bg-orange-500 hover:bg-orange-600"
              >
                Done 🎉
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
