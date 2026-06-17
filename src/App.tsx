/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Library, 
  History, 
  Quote as QuoteIcon, 
  Settings as SettingsIcon, 
  Plus, 
  LogOut,
  Calendar,
  BookOpen,
  Target,
  Trash2,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';
import { useFirebase } from './hooks/useFirebase';
import { signInWithGoogle, logout } from './lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import GlassCard from './components/layout/GlassCard';
import LoadingSpinner from './components/layout/LoadingSpinner';
import PomodoroTimer from './components/pomodoro/Timer';
import QuoteCarousel from './components/quotes/QuoteCarousel';
import ReadingAnalytics from './components/reading/Analytics';
import BookItem from './components/reading/BookItem';
import { Book, BookStatus } from './types';
import { cn } from './lib/utils';
import { format } from 'date-fns';
import { Toaster, toast } from 'sonner';
import AddBookModal from './components/modals/AddBookModal';
import AddQuoteModal from './components/modals/AddQuoteModal';
import AddReviewModal from './components/modals/AddReviewModal';
import DailyInspiration from './components/quotes/DailyInspiration';

export default function App() {
  const { user, books, logs, quotes, reviews, loading, addBook, updateBookProgress, addLog, addQuote, addReview, deleteBook, deleteQuote } = useFirebase();
  const [activeTab, setActiveTab] = useState<'reading' | 'habits' | 'quotes'>('reading');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isLogging, setIsLogging] = useState<Book | null>(null);
  const [isReviewing, setIsReviewing] = useState<Book | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoggingProgress, setIsLoggingProgress] = useState(false);
  const [isAddingQuote, setIsAddingQuote] = useState(false);
  const [deletingQuoteId, setDeletingQuoteId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_-12px_rgba(37,99,235,0.3)]">
            <BookOpen size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter mb-4 text-slate-900">MidR</h1>
          <p className="text-slate-400 max-w-xs mx-auto mb-10 text-lg">
            A minimalist sanctuary for your reading journey.
          </p>
          <button
            onClick={async () => {
              setIsSigningIn(true);
              try {
                await signInWithGoogle();
              } catch (error) {
                toast.error("Sign in failed");
              } finally {
                setIsSigningIn(false);
              }
            }}
            disabled={isSigningIn}
            className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 mx-auto shadow-xl active:scale-95 disabled:opacity-70 disabled:active:scale-100 min-w-[240px]"
            id="google-signin"
          >
            {isSigningIn ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
                Continue with Google
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  const readingBooks = books.filter(b => b.status === 'reading');
  const tbrBooks = books.filter(b => b.status === 'tbr');
  const finishedBooks = books.filter(b => b.status === 'finished');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row">
      <Toaster position="top-right" richColors />
      {/* Sidebar */}
      <nav className="w-full lg:w-24 lg:h-screen border-b lg:border-r border-slate-200 flex lg:flex-col items-center py-4 lg:py-8 px-6 lg:px-0 gap-8 justify-between lg:justify-start z-40 bg-white/60 backdrop-blur-xl shrink-0">
        <div className="text-2xl font-black bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          M
        </div>
        
        <div className="flex lg:flex-col gap-3">
          <NavButton active={activeTab === 'reading'} onClick={() => setActiveTab('reading')} icon={<Library size={24} />} activeColor="bg-primary" />
          <NavButton active={activeTab === 'habits'} onClick={() => setActiveTab('habits')} icon={<Calendar size={24} />} activeColor="bg-secondary" />
          <NavButton active={activeTab === 'quotes'} onClick={() => setActiveTab('quotes')} icon={<QuoteIcon size={24} />} activeColor="bg-ternary" />
        </div>

        <button 
          onClick={logout}
          className="lg:mt-auto p-4 text-slate-300 hover:text-secondary transition-colors"
          id="logout-btn"
          title="Logout"
        >
          <LogOut size={24} />
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-80px)] lg:h-screen overflow-y-auto p-4 lg:p-12 scrollbar-hide">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column - Dynamic Content */}
          <div className="lg:col-span-8 space-y-12">
            <header className="flex justify-between items-end">
              <div>
                <p className="text-primary font-bold tracking-widest uppercase text-[10px] mb-2">Hello Reader</p>
                <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-900">Your Library</h2>
              </div>
              <button 
                onClick={() => setIsAddingBook(true)}
                className="bg-primary hover:bg-blue-600 text-white p-3 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                id="add-book-trigger"
              >
                <Plus size={28} />
              </button>
            </header>

            <AnimatePresence mode="wait">
              {activeTab === 'reading' && (
                <motion.div 
                  key="reading"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Currently Reading
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {readingBooks.length > 0 ? (
                        readingBooks.map(book => (
                          <BookItem 
                            key={book.id} 
                            book={book} 
                            onUpdateProgress={(b) => setIsLogging(b)}
                            onMarkFinished={(b) => {
                              updateBookProgress(b.id!, b.totalPages, 'finished');
                              toast.success(`Congratulations! You've finished "${b.title}"`);
                            }}
                            onDelete={(id) => {
                              deleteBook(id);
                              toast.error("Book removed from library");
                            }}
                            onReview={(b) => setIsReviewing(b)}
                            review={reviews.find(r => r.bookId === book.id)}
                          />
                        ))
                      ) : (
                        <div className="col-span-1 md:col-span-2 py-16 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 bg-white/50">
                           <BookOpen size={48} className="mb-4 opacity-30" />
                           <p className="font-medium">Curate your next adventure.</p>
                        </div>
                      )}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      To Read (TBR)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {tbrBooks.map(book => (
                        <BookItem 
                          key={book.id} 
                          book={book} 
                          onUpdateProgress={(b) => {
                            updateBookProgress(b.id!, b.currentPage, 'reading');
                            toast.info(`"${b.title}" moved to Currently Reading`);
                          }}
                          onMarkFinished={(b) => {
                            updateBookProgress(b.id!, b.totalPages, 'finished');
                            toast.success(`Congratulations! You've finished "${b.title}"`);
                          }}
                          onDelete={(id) => {
                            deleteBook(id);
                            toast.error("Book removed from library");
                          }}
                          onReview={(b) => setIsReviewing(b)}
                          review={reviews.find(r => r.bookId === book.id)}
                        />
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'habits' && (
                <motion.div 
                  key="habits"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Activity Insight
                    </h3>
                    <ReadingAnalytics logs={logs} />
                  </section>
                  
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ternary" />
                      Finished Collection
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {finishedBooks.length > 0 ? (
                        finishedBooks.map(book => (
                          <BookItem 
                            key={book.id} 
                            book={book} 
                            onUpdateProgress={() => {}}
                            onMarkFinished={() => {}}
                            onDelete={(id) => {
                              deleteBook(id);
                              toast.error("Removed from collection");
                            }}
                            onReview={(b) => setIsReviewing(b)}
                            review={reviews.find(r => r.bookId === book.id)}
                          />
                        ))
                      ) : (
                        <p className="text-slate-300 text-sm italic col-span-2 text-center py-4">No finished books yet. Keep reading!</p>
                      )}
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'quotes' && (
                <motion.div 
                  key="quotes"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <DailyInspiration quote={quotes[0]} />
                  <GlassCard className="p-8 lg:p-12">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-black text-slate-900 italic">Memorable Quotes</h3>
                      <QuoteIcon size={32} className="text-primary/20" />
                    </div>
                    <div className="space-y-10">
                      {quotes.map(q => (
                        <div key={q.id} className="group relative">
                          <div className="absolute -left-6 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-primary transition-colors rounded-full" />
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-xl font-medium text-slate-800 leading-relaxed">"{q.content}"</p>
                            <button 
                              onClick={async () => {
                                if (confirm('Delete this quote?')) {
                                  setDeletingQuoteId(q.id!);
                                  try {
                                    await deleteQuote(q.id!);
                                    toast.error("Quote deleted");
                                  } finally {
                                    setDeletingQuoteId(null);
                                  }
                                }
                              }}
                              disabled={deletingQuoteId === q.id}
                              className="p-2 text-slate-200 hover:text-secondary opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                            >
                              {deletingQuoteId === q.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                          </div>
                          <div className="mt-3 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
                            {q.author} {q.bookTitle && ` — ${q.bookTitle}`}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setIsAddingQuote(true)}
                      className="mt-12 w-full py-6 border-2 border-dashed border-slate-200 rounded-3xl hover:border-primary hover:bg-primary/5 text-slate-400 hover:text-primary transition-all text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      + Add New Insight
                    </button>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Utilities */}
          <div className="lg:col-span-4 space-y-10">
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Focus Session</h3>
              <PomodoroTimer />
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Daily Inspiration</h3>
              <GlassCard className="p-0 py-10 bg-primary/5 border-primary/10 shadow-blue-500/5">
                <QuoteCarousel quotes={quotes} />
              </GlassCard>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Goal Status</h3>
              <GlassCard className="relative overflow-hidden group border-white/40">
                <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12">
                  <Target size={120} />
                </div>
                <div className="relative z-10">
                  <p className="text-4xl font-black text-slate-900 mb-1">{logs.length > 0 ? logs[0].pagesRead : 0}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Pages read today</p>
                  <div className="mt-6 h-2 w-full bg-slate-100 rounded-full">
                    <div className="h-full bg-primary rounded-full shadow-lg shadow-blue-500/20" style={{ width: '40%' }} />
                  </div>
                </div>
              </GlassCard>
            </section>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isAddingBook && (
          <AddBookModal 
            onClose={() => setIsAddingBook(false)} 
            onAdd={async (bookData) => {
              await addBook(bookData as any);
              toast.success(`"${bookData.title}" added to your library`);
            }} 
          />
        )}

        {isAddingQuote && (
          <AddQuoteModal 
            onClose={() => setIsAddingQuote(false)} 
            onAdd={async (quoteData) => {
              await addQuote(quoteData);
              toast.success("New quote added to your collection");
            }} 
          />
        )}

        {isReviewing && (
          <AddReviewModal 
            book={isReviewing} 
            onClose={() => setIsReviewing(null)} 
            onAdd={async (reviewData) => {
              await addReview(reviewData);
            }} 
          />
        )}

        {isLogging && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLogging(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" />
            <GlassCard className="w-full max-w-sm relative z-10 border-white/60 shadow-2xl p-6 sm:p-10 my-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Log Progress</h1>
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1">{isLogging.title}</p>
                </div>
                <button onClick={() => setIsLogging(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsLoggingProgress(true);
                try {
                  const pages = parseInt(new FormData(e.currentTarget).get('pages') as string);
                  const newTotal = isLogging.currentPage + pages;
                  await updateBookProgress(isLogging.id!, Math.min(newTotal, isLogging.totalPages), newTotal >= isLogging.totalPages ? 'finished' : 'reading');
                  await addLog({
                    bookId: isLogging.id,
                    date: format(new Date(), 'yyyy-MM-dd'),
                    pagesRead: pages,
                    durationMinutes: 30, // Mock duration
                  });
                  toast.success(`Logged ${pages} pages for "${isLogging.title}"`);
                  setIsLogging(null);
                } catch (error) {
                  toast.error("Failed to log progress");
                } finally {
                  setIsLoggingProgress(false);
                }
              }} className="space-y-6">
                <div className="text-center">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 block">Pages Added Today</label>
                  <input name="pages" type="number" autoFocus required className="w-full bg-transparent border-b-4 border-slate-100 focus:border-primary p-4 outline-none text-center text-6xl font-black text-slate-900 transition-all placeholder:text-slate-100" placeholder="0" />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoggingProgress}
                  className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
                >
                  {isLoggingProgress ? <Loader2 size={20} className="animate-spin" /> : 'Update Tracker'}
                </button>
              </form>
            </GlassCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, icon, onClick, activeColor = "bg-primary" }: { active: boolean, icon: React.ReactNode, onClick: () => void, activeColor?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all duration-300 relative",
        active ? `${activeColor} text-white shadow-xl` : "text-slate-300 hover:bg-slate-50 hover:text-slate-600"
      )}
    >
      {icon}
      {active && (
        <motion.div 
          layoutId="nav-active"
          className={cn("absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full hidden lg:block", activeColor)}
        />
      )}
    </button>
  );
}
