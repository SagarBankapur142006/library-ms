import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService, type Book } from '../../src/services/storage';

describe('SCRUM-16: Issue & Return Circulation Engine (Sagar S Bankapur)', () => {
  beforeEach(() => {
    StorageService.resetState();
  });

  it('should successfully issue an available book to an active member', () => {
    // Book 1: The Great Gatsby, Member 2 (Active, 0 books checked out)
    const booksBefore = StorageService.getBooks();
    const targetBook = booksBefore.find((b) => b.id === 1)!;
    const initialCopies = targetBook.availableCopies;

    const result = StorageService.issueBook(1, 2, 1);
    expect(result.success).toBe(true);

    // Verify copy count decremented
    const booksAfter = StorageService.getBooks();
    const updatedBook = booksAfter.find((b) => b.id === 1)!;
    expect(updatedBook.availableCopies).toBe(initialCopies - 1);

    // Verify member booksCheckedOut incremented
    const member = StorageService.getMembers().find((m) => m.id === 2)!;
    expect(member.booksCheckedOut).toBe(1);
  });

  it('should reject checkout if the member is suspended', () => {
    // Member 3 is seeded as 'Suspended'
    const result = StorageService.issueBook(1, 3, 1);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/suspended/i);
  });

  it('should reject checkout if book copies are exhausted', () => {
    // Set book copies to 0
    const books = StorageService.getBooks();
    const targetBook: Book = {
      ...books[0],
      availableCopies: 0,
    };
    StorageService.saveBook(targetBook);

    const result = StorageService.issueBook(books[0].id, 2, 1);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/no copies available/i);
  });

  it('should calculate accrued fine correctly for overdue loans', () => {
    const settings = StorageService.getSettings();
    const dailyRate = settings.dailyFineAmount;

    // Create mock overdue transaction due 4 days ago at current time
    const now = new Date();
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
    const dueDateStr = fourDaysAgo.toISOString();

    const mockTransaction = {
      id: 999,
      bookId: 1,
      memberId: 2,
      issuedByUserId: 1,
      issueDate: '2026-08-01',
      dueDate: dueDateStr,
      returnDate: null,
      status: 'Issued' as const,
    };

    const fine = StorageService.calculateAccruedFine(mockTransaction);
    expect(fine).toBeGreaterThanOrEqual(4 * dailyRate);
  });

  it('should process book return and restore copy count', () => {
    // Issue a book first
    StorageService.issueBook(2, 2, 1);
    const tx = StorageService.getTransactions().find(
      (t) => t.bookId === 2 && t.memberId === 2 && t.status === 'Issued'
    )!;

    const bookBefore = StorageService.getBooks().find((b) => b.id === 2)!;
    const copiesBefore = bookBefore.availableCopies;

    const returnResult = StorageService.returnBook(tx.id);
    expect(returnResult.success).toBe(true);

    // Check transaction status updated
    const txAfter = StorageService.getTransactions().find((t) => t.id === tx.id)!;
    expect(txAfter.status).toBe('Returned');
    expect(txAfter.returnDate).not.toBeNull();

    // Check book copy count incremented back
    const bookAfter = StorageService.getBooks().find((b) => b.id === 2)!;
    expect(bookAfter.availableCopies).toBe(copiesBefore + 1);
  });
});
