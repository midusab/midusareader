/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote as QuoteIcon } from 'lucide-react';
import { Quote } from '@/src/types';

interface QuoteCarouselProps {
  quotes: Quote[];
}

export default function QuoteCarousel({ quotes }: QuoteCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (quotes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  if (quotes.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-slate-300 px-10 text-center italic font-medium leading-relaxed">
        "Fill your shelves with stories, and your heart will follow."
      </div>
    );
  }

  const currentQuote = quotes[currentIndex];

  return (
    <div className="relative h-40 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-center px-12"
        >
          <QuoteIcon className="text-primary/10 absolute top-0 left-6 w-10 h-10 -z-10" />
          <p className="text-lg font-bold italic leading-relaxed text-slate-800 tracking-tight">
            "{currentQuote.content}"
          </p>
          <div className="mt-4 flex flex-col">
            <span className="text-xs font-black text-primary uppercase tracking-widest">
              {currentQuote.author || "Unknown Author"}
            </span>
            {currentQuote.bookTitle && (
              <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-1 font-bold">
                {currentQuote.bookTitle}
              </span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
