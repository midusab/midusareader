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
import { Book, DailyLog, Quote, UserSettings } from '../types';

export function useFirebase() {
  const [books, setBooks] = useState<Book[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
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
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const logsQuery = query(
      collection(db, 'logs'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const quotesQuery = query(
      collection(db, 'quotes'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubBooks = onSnapshot(booksQuery, (snap) => {
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() } as Book)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'books'));

    const unsubLogs = onSnapshot(logsQuery, (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as DailyLog)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'logs'));

    const unsubQuotes = onSnapshot(quotesQuery, (snap) => {
      setQuotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Quote)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'quotes'));

    return () => {
      unsubBooks();
      unsubLogs();
      unsubQuotes();
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

  return {
    user,
    books,
    logs,
    quotes,
    loading,
    addBook,
    updateBookProgress,
    addLog,
    addQuote,
    deleteBook,
    deleteQuote
  };
}
