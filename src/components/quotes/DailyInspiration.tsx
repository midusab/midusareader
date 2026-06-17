/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import GlassCard from '../layout/GlassCard';
import { Quote } from '@/src/types';

interface DailyInspirationProps {
  quote?: Quote;
}

export default function DailyInspiration({ quote }: DailyInspirationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-[2.5rem] overflow-hidden mb-8 group"
    >
      <div className="absolute inset-0">
        <img 
          src="/src/assets/images/inspiration_bg_1781731089252.jpg" 
          alt="Inspiration"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-slate-900/30 to-transparent" />
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]" />
      </div>
      
      <div className="relative p-10 lg:p-14 flex flex-col items-center text-center min-h-[360px] justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-8 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"
        >
          Daily Inspiration
        </motion.div>
        
        {quote ? (
          <>
            <h2 className="text-2xl lg:text-3xl font-medium text-white leading-relaxed max-w-2xl italic">
              "{quote.content}"
            </h2>
            <div className="mt-8 text-xs font-bold text-white/80 uppercase tracking-widest border-t border-white/20 pt-4">
              {quote.author}
            </div>
          </>
        ) : (
          <h2 className="text-2xl font-medium text-white leading-relaxed max-w-2xl italic">
            "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
            <div className="mt-8 text-xs font-bold text-white/80 uppercase tracking-widest border-t border-white/20 pt-4">
              Dr. Seuss
            </div>
          </h2>
        )}
      </div>
    </motion.div>
  );
}
