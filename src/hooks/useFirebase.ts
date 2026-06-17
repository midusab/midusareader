/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Book, DailyLog, Quote, Review, UserSettings } from '../types';

export function useFirebase() {
  const [books, setBooks] = useState<Book[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    return auth.onAuthStateChanged((u) => {
      setUser(u);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setBooks([]);
      setLogs([]);
      setQuotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const booksQuery = query(
      collection(db, 'books'),
      where('userId', '==', user.uid)
    );

    const logsQuery = query(
      collection(db, 'logs'),
      where('userId', '==', user.uid)
    );

    const quotesQuery = query(
      collection(db, 'quotes'),
      where('userId', '==', user.uid)
    );

    const unsubBooks = onSnapshot(booksQuery, (snap) => {
      const sortedBooks = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as Book))
        .sort((a, b) => {
          const timeA = b.updatedAt?.toMillis?.() || 0;
          const timeB = a.updatedAt?.toMillis?.() || 0;
          return timeA - timeB;
        });
      setBooks(sortedBooks);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'books'));

    const unsubLogs = onSnapshot(logsQuery, (snap) => {
      const sortedLogs = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as DailyLog))
        .sort((a, b) => {
          const timeA = b.createdAt?.toMillis?.() || 0;
          const timeB = a.createdAt?.toMillis?.() || 0;
          return timeA - timeB;
        });
      setLogs(sortedLogs);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'logs'));

    const unsubQuotes = onSnapshot(quotesQuery, (snap) => {
      const sortedQuotes = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as Quote))
        .sort((a, b) => {
          const timeA = b.createdAt?.toMillis?.() || 0;
          const timeB = a.createdAt?.toMillis?.() || 0;
          return timeA - timeB;
        });
      setQuotes(sortedQuotes);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'quotes'));

    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('userId', '==', user.uid)
    );

    const unsubReviews = onSnapshot(reviewsQuery, (snap) => {
      const sortedReviews = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as Review))
        .sort((a, b) => {
          const timeA = b.createdAt?.toMillis?.() || 0;
          const timeB = a.createdAt?.toMillis?.() || 0;
          return timeA - timeB;
        });
      setReviews(sortedReviews);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'reviews'));

    return () => {
      unsubBooks();
      unsubLogs();
      unsubQuotes();
      unsubReviews();
    };
  }, [user]);

  const addBook = async (book: Partial<Book>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'books'), {
        ...book,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'books');
    }
  };

  const updateBookProgress = async (bookId: string, current: number, status?: string) => {
    try {
      const bookRef = doc(db, 'books', bookId);
      const updates: any = {
        currentPage: current,
        updatedAt: serverTimestamp(),
      };
      if (status) updates.status = status;
      await updateDoc(bookRef, updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `books/${bookId}`);
    }
  };

  const addLog = async (log: Partial<DailyLog>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'logs'), {
        ...log,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'logs');
    }
  };

  const addQuote = async (quote: Partial<Quote>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'quotes'), {
        ...quote,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'quotes');
    }
  };

  const deleteBook = async (bookId: string) => {
    try {
      await deleteDoc(doc(db, 'books', bookId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `books/${bookId}`);
    }
  };

  const deleteQuote = async (quoteId: string) => {
    try {
      await deleteDoc(doc(db, 'quotes', quoteId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `quotes/${quoteId}`);
    }
  };

  const addReview = async (review: Partial<Review>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'reviews'), {
        ...review,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'reviews');
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `reviews/${reviewId}`);
    }
  };

  return {
    user,
    books,
    logs,
    quotes,
    reviews,
    loading,
    addBook,
    updateBookProgress,
    addLog,
    addQuote,
    addReview,
    deleteBook,
    deleteQuote,
    deleteReview
  };
}
