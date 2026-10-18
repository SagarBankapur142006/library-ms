import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService, type Book } from '../../src/services/storage';

describe('SCRUM-9 & SCRUM-14: Book Management & Inventory Module (Sagar S Bankapur)', () => {
  beforeEach(() => {
    StorageService.resetState();
  });

  it('should fetch the default seeded book collection', () => {
    const books = StorageService.getBooks();
    expect(books.length).toBeGreaterThanOrEqual(4);
    const titles = books.map((b) => b.title);
    expect(titles).toContain('The Great Gatsby');
    expect(titles).toContain('Clean Code');
  });

  it('should add a new book to the library catalog with unique ID', () => {
    const initialBooks = StorageService.getBooks();
    const nextId = Math.max(...initialBooks.map((b) => b.id)) + 1;
    const newBook: Book = {
      id: nextId,
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
      isbn: '9780201633610',
      genre: 'Software Engineering',
      publisher: 'Addison-Wesley',
      publicationYear: 1994,
      totalCopies: 6,
      availableCopies: 6,
    };

    StorageService.saveBook(newBook);

    const reloaded = StorageService.getBooks();
    expect(reloaded.length).toBe(initialBooks.length + 1);
    const found = reloaded.find((b) => b.id === nextId);
    expect(found).toBeDefined();
    expect(found?.title).toBe('Design Patterns: Elements of Reusable Object-Oriented Software');
  });

  it('should update existing book inventory details', () => {
    const books = StorageService.getBooks();
    const targetBook = books[0];
    const updatedBook: Book = {
      ...targetBook,
      totalCopies: 10,
      availableCopies: 8,
    };

    StorageService.saveBook(updatedBook);

    const reloaded = StorageService.getBooks().find((b) => b.id === targetBook.id);
    expect(reloaded?.totalCopies).toBe(10);
    expect(reloaded?.availableCopies).toBe(8);
  });

  it('should delete a book from the catalog by ID when copies are not checked out', () => {
    // Book 3 has no active checkouts in seeded state
    const books = StorageService.getBooks();
    const book3 = books.find((b) => b.id === 3)!;
    expect(book3).toBeDefined();

    const success = StorageService.deleteBook(3);
    expect(success).toBe(true);

    const reloaded = StorageService.getBooks().find((b) => b.id === 3);
    expect(reloaded).toBeUndefined();
  });

  it('should prevent deleting a book if copies are currently checked out', () => {
    // Book 4 (Clean Code) has 1 checked out copy in seeded transactions
    const success = StorageService.deleteBook(4);
    expect(success).toBe(false);

    // Book should still exist in catalog
    const book4 = StorageService.getBooks().find((b) => b.id === 4);
    expect(book4).toBeDefined();
  });
});
