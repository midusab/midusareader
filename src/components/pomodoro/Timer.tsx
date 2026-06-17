/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';
import GlassCard from '../layout/GlassCard';
import { cn } from '@/src/lib/utils';

export default function PomodoroTimer() {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  }, [mode]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      // Logic for switching mode could go here
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setTimeLeft(nextMode === 'work' ? 25 * 60 : 5 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <GlassCard className="flex flex-col items-center justify-center p-8 bg-white/70">
      <div className="flex items-center gap-2 mb-6">
        {mode === 'work' ? (
          <div className="flex items-center text-primary gap-1 text-[10px] uppercase font-black tracking-widest">
            <BookOpen size={16} />
            Focus Session
          </div>
        ) : (
          <div className="flex items-center text-ternary gap-1 text-[10px] uppercase font-black tracking-widest">
            <Coffee size={16} />
            Short Break
          </div>
        )}
      </div>

      <div className="text-7xl font-black font-mono tracking-tighter mb-10 tabular-nums text-slate-900">
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className={cn(
            "p-5 rounded-3xl transition-all duration-300 transform active:scale-95 shadow-xl flex items-center justify-center",
            isActive 
              ? "bg-secondary text-white shadow-secondary/30" 
              : "bg-primary text-white hover:bg-blue-600 shadow-primary/30"
          )}
          id="pomodoro-toggle"
        >
          {isActive ? <Pause size={28} /> : <Play size={28} />}
        </button>
        <button
          onClick={resetTimer}
          className="p-5 rounded-3xl bg-slate-50 text-slate-500 hover:text-secondary hover:bg-secondary/5 transition-all active:scale-95 border border-slate-100 flex items-center justify-center"
          id="pomodoro-reset"
        >
          <RotateCcw size={28} />
        </button>
      </div>
    </GlassCard>
  );
}
