/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Loader2, Star } from 'lucide-react';
import GlassCard from '../layout/GlassCard';
import { Book, Review } from '@/src/types';
import { toast } from 'sonner';

interface AddReviewModalProps {
  book: Book;
  onClose: () => void;
  onAdd: (review: Partial<Review>) => Promise<void>;
}

export default function AddReviewModal({ book, onClose, onAdd }: AddReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please share your thoughts');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        bookId: book.id,
        rating,
        comment: comment.trim(),
      });
      toast.success(`Review for "${book.title}" saved`);
      onClose();
    } catch (error) {
      toast.error('Failed to save review');
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
      
      <GlassCard className="w-full max-w-md relative z-10 border-white/60 shadow-2xl my-auto p-6 sm:p-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">Review & Thoughts</h3>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1">{book.title}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    size={32} 
                    className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {rating === 5 ? 'Masterpiece' : rating === 4 ? 'Great Read' : rating === 3 ? 'Decent' : rating === 2 ? 'Underwhelming' : 'Not for me'}
            </span>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
              Reflections
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What made this book special?"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:border-primary transition-all text-slate-800 text-sm leading-relaxed min-h-[120px] resize-none"
              required
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
          >
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : 'Complete Review'}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
