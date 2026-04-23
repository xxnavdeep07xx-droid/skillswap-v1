'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  getUserById,
  mockSkillsTeach,
  mockAvailability,
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';

interface BookingSheetProps {
  coachId: string;
}

const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
];

function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getDayNumber(date: Date): string {
  return date.getDate().toString();
}

export function BookingSheet({ coachId }: BookingSheetProps) {
  const { popView } = useAppStore();
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const coach = getUserById(coachId);
  const skills = mockSkillsTeach[coachId] || [];

  // Default to first skill
  const skillToBook = selectedSkill || skills[0]?.skillName || 'Session';

  // Next 7 days
  const dates = useMemo(() => {
    const result: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      result.push(d);
    }
    return result;
  }, []);

  const spCost = 25; // Mock SP cost

  const handleConfirm = () => {
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }
    toast.success(
      `Booking confirmed with ${coach?.name} on ${dates[selectedDate].toLocaleDateString()} at ${selectedTime}! 🎉`,
    );
    popView();
  };

  if (!coach) return null;

  return (
    <Drawer open onOpenChange={(open) => { if (!open) popView(); }}>
      <DrawerContent className="rounded-t-2xl max-w-md mx-auto">
        <DrawerHeader className="text-center">
          <DrawerTitle>Book a Session</DrawerTitle>
          <DrawerDescription>Choose a date, time, and skill</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-8">
          {/* Coach mini profile */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-5">
            {coach.image ? (
              <Image
                src={coach.image}
                alt={coach.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {coach.name[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {coach.name}
              </p>
              <p className="text-xs text-slate-500">
                {coach.averageRating} ⭐ · {coach.totalSessionsTaught} sessions
              </p>
            </div>
          </div>

          {/* Skill selection */}
          {skills.length > 1 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-foreground mb-2">
                What do you want to learn?
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <button
                    key={s.skillName}
                    onClick={() => setSelectedSkill(s.skillName)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      (selectedSkill || skills[0].skillName) === s.skillName
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s.skillName}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Separator className="mb-4" />

          {/* Date selector */}
          <div className="mb-5">
            <p className="text-sm font-medium text-foreground mb-2">
              Select Date
            </p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {dates.map((date, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(idx)}
                  className={`flex flex-col items-center px-3 py-2.5 rounded-xl min-w-[52px] transition-all ${
                    selectedDate === idx
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase">
                    {getDayName(date)}
                  </span>
                  <span className="text-lg font-bold">{getDayNumber(date)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time slots */}
          <div className="mb-5">
            <p className="text-sm font-medium text-foreground mb-2">
              Select Time
            </p>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Cost */}
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl mb-5">
            <div className="flex items-center gap-2">
              <Coins size={18} className="text-amber-500" />
              <span className="text-sm font-medium text-foreground">
                Session Cost
              </span>
            </div>
            <span className="text-lg font-bold text-amber-600">
              {spCost} SP
            </span>
          </div>

          {/* Confirm */}
          <Button
            onClick={handleConfirm}
            className="w-full h-12 text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
          >
            Confirm Booking
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
