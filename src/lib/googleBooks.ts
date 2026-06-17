/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface GoogleBookInfo {
  title: string;
  authors?: string[];
  description?: string;
  pageCount?: number;
  imageLinks?: {
    thumbnail?: string;
  };
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
}

export async function fetchBookByIsbn(isbn: string) {
  const cleanIsbn = isbn.replace(/[- ]/g, '');
  if (!cleanIsbn) return null;

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const info = data.items[0].volumeInfo as GoogleBookInfo;
      return {
        title: info.title || '',
        author: info.authors ? info.authors.join(', ') : '',
        totalPages: info.pageCount || 0,
        coverUrl: info.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
        description: info.description || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching from Google Books:', error);
    return null;
  }
}
