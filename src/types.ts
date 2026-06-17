/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BookStatus = 'reading' | 'tbr' | 'finished';

export interface Book {
  id?: string;
  userId: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: BookStatus;
  isbn?: string;
  coverUrl?: string;
  category?: string;
  notes?: string;
  createdAt: any;
  updatedAt: any;
}

export interface DailyLog {
  id?: string;
  userId: string;
  bookId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  pagesRead: number;
  durationMinutes: number;
  createdAt: any;
}

export interface Quote {
  id?: string;
  userId: string;
  content: string;
  author?: string;
  bookTitle?: string;
  createdAt: any;
}

export interface UserSettings {
  userId: string;
  pomodoroWorkTime: number; // in minutes
  pomodoroBreakTime: number; // in minutes
}

export interface PomodoroState {
  isActive: boolean;
  timeLeft: number; // in seconds
  mode: 'work' | 'break';
}
