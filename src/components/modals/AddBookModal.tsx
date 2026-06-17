/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import GlassCard from '../layout/GlassCard';
import { Book, BookStatus } from '@/src/types';
import { fetchBookByIsbn } from '@/src/lib/googleBooks';
import { toast } from 'sonner';
import { Search, Loader2 } from 'lucide-react';

interface AddBookModalProps {
  onClose: () => void;
  onAdd: (book: Omit<Book, 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export default function AddBookModal({ onClose, onAdd }: AddBookModalProps) {
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState<number | string>('');
  const [coverUrl, setCoverUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<BookStatus>('reading');
  const [isFetching, setIsFetching] = useState(false);

  const handleIsbnSearch = async () => {
    if (!isbn) return;
    setIsFetching(true);
    try {
      const bookData = await fetchBookByIsbn(isbn);
      if (bookData) {
        setTitle(bookData.title);
        setAuthor(bookData.author);
        setTotalPages(bookData.totalPages);
        setCoverUrl(bookData.coverUrl);
        toast.success('Book details auto-filled!');
      } else {
        toast.error('Book not found with this ISBN');
      }
    } catch (error) {
      toast.error('Error searching for ISBN');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !totalPages || !coverUrl) {
      toast.error('Please fill in all mandatory fields (Title, Author, Pages, Cover URL)');
      return;
    }

    await onAdd({
      title,
      author,
      totalPages: Number(totalPages),
      currentPage: 0,
      status,
      isbn,
      coverUrl,
      notes,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
      />
      <GlassCard className="w-full max-w-md relative z-10 border-white/60 shadow-2xl my-auto">
        <h3 className="text-2xl font-black mb-6 text-slate-900">Add New Book</h3>
        
        <div className="mb-6">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">ISBN Auto-fill</label>
          <div className="flex gap-2">
            <input 
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Enter ISBN-10 or ISBN-13"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all text-slate-800 text-sm" 
            />
            <button 
              onClick={handleIsbnSearch}
              disabled={isFetching || !isbn}
              className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {isFetching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Title *</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 outline-none focus:border-primary transition-all text-slate-800 text-sm" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Author *</label>
            <input 
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 outline-none focus:border-primary transition-all text-slate-800 text-sm" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Cover Image URL *</label>
            <input 
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              required
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 outline-none focus:border-primary transition-all text-slate-800 text-sm" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Total Pages *</label>
              <input 
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                type="number" 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 outline-none focus:border-primary transition-all text-slate-800 text-sm" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Initial Status *</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as BookStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 outline-none focus:border-primary transition-all text-slate-800 text-sm appearance-none"
              >
                <option value="reading">Reading</option>
                <option value="tbr">TBR (Backlog)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Initial Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-3 outline-none focus:border-primary transition-all h-20 resize-none text-slate-800 text-sm" 
            />
          </div>

          <button type="submit" className="w-full py-4 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-transform mt-2">
            Add to Library
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
