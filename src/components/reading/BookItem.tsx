/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book } from '@/src/types';
import { motion } from 'motion/react';
import { Book as BookIcon, CheckCircle2, Bookmark, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface BookItemProps {
  book: Book;
  onUpdateProgress: (book: Book) => void;
  onMarkFinished: (book: Book) => void;
  onDelete: (id: string) => void;
}

export default function BookItem({ book, onUpdateProgress, onMarkFinished, onDelete }: BookItemProps) {
  const progress = Math.min(Math.round((book.currentPage / book.totalPages) * 100), 100);

  return (
    <motion.div 
      layout
      className="group relative bg-white hover:bg-white border border-slate-100 hover:border-blue-100 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
    >
      <div className="flex gap-5">
        <div className="w-20 h-28 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-inner shrink-0">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <BookIcon size={36} strokeWidth={1.5} className="opacity-40" />
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="font-bold text-slate-900 truncate leading-tight mb-1">{book.title}</h4>
          <p className="text-[11px] font-bold text-slate-500 mb-4 truncate uppercase tracking-widest">{book.author}</p>
          
          <div className="space-y-2 mt-auto">
            <div className="flex justify-between text-[10px] items-center">
              <span className="font-black text-slate-500 tracking-widest uppercase">{book.currentPage} / {book.totalPages}</span>
              <span className="font-black text-primary px-2 py-0.5 bg-primary/5 rounded-md">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  book.status === 'finished' ? "bg-ternary shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {book.notes && (
        <div className="mt-4 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-500 italic line-clamp-1">
            "{book.notes}"
          </p>
        </div>
      )}

      <div className="mt-5 flex gap-2">
        {book.status !== 'finished' ? (
          <>
            <button 
              onClick={() => onUpdateProgress(book)}
              className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-200"
            >
              <Bookmark size={14} /> Update
            </button>
            <button 
              onClick={() => onMarkFinished(book)}
              className="px-4 py-3 rounded-xl bg-ternary/10 text-ternary hover:bg-ternary hover:text-white transition-all flex items-center justify-center active:scale-95"
              title="Mark as finished"
            >
              <CheckCircle2 size={18} />
            </button>
          </>
        ) : (
          <div className="flex-1 text-center py-2 px-4 bg-ternary/5 rounded-xl border border-ternary/10">
             <span className="text-[10px] font-black text-ternary uppercase tracking-widest flex items-center justify-center gap-2">
               <CheckCircle2 size={14} /> Journey Completed
             </span>
          </div>
        )}
        <button 
          onClick={() => confirm('Delete this book?') && onDelete(book.id!)}
          className="px-4 py-3 rounded-xl bg-slate-50 text-slate-300 hover:bg-secondary/10 hover:text-secondary transition-all flex items-center justify-center active:scale-95 border border-slate-100"
          title="Delete book"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
