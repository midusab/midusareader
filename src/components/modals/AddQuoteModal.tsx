/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, Quote as QuoteIcon } from 'lucide-react';
import GlassCard from '../layout/GlassCard';
import { Quote } from '@/src/types';
import { toast } from 'sonner';

interface AddQuoteModalProps {
  onClose: () => void;
  onAdd: (quote: Partial<Quote>) => Promise<void>;
}

export default function AddQuoteModal({ onClose, onAdd }: AddQuoteModalProps) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please enter the quote content');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        content: content.trim(),
        author: author.trim() || 'Unknown Author',
        bookTitle: bookTitle.trim(),
      });
      onClose();
    } catch (error) {
      // Error handled in hook/toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
      />
      
      <GlassCard className="w-full max-w-lg relative z-10 border-white/60 shadow-2xl my-auto p-6 sm:p-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <QuoteIcon size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">New Insight</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
              The Quote
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What wisdom did you find?"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:border-primary transition-all text-slate-800 text-lg font-medium leading-relaxed min-h-[160px] resize-none"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                Source/Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Who said it?"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:border-primary transition-all text-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                Book Title (Optional)
              </label>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="From which book?"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:border-primary transition-all text-slate-800 text-sm"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100 mt-4"
          >
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : 'Save Insight'}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
