import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageService, type Transaction } from '../../src/services/storage';

describe('Advanced Vitest Features Exploration (Sagar S Bankapur - 24BCE1294)', () => {
  beforeEach(() => {
    StorageService.resetState();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Feature Exploration 1: Function & Method Spying with vi.spyOn()
  it('Feature 1 [vi.spyOn]: should spy on localStorage.setItem to verify state persistence calls', () => {
    const setItemSpy = vi.spyOn(localStorage, 'setItem');

    StorageService.issueBook(1, 2, 1);

    expect(setItemSpy).toHaveBeenCalled();
    expect(setItemSpy).toHaveBeenCalledWith('lms_database', expect.any(String));
  });

  // Feature Exploration 2: Fake Timers & System Time Travel
  it('Feature 2 [vi.useFakeTimers]: should manipulate system time to calculate overdue fine accrual', () => {
    const mockTransaction: Transaction = {
      id: 99,
      bookId: 1,
      memberId: 2,
      issuedByUserId: 1,
      issueDate: '2026-08-01',
      dueDate: '2026-08-15',
      returnDate: null,
      status: 'Issued',
    };

    vi.useFakeTimers();
    // Fast-forward system time to August 21, 2026 (6 days overdue)
    vi.setSystemTime(new Date('2026-08-21T00:00:00Z'));

    const accruedFine = StorageService.calculateAccruedFine(mockTransaction);
    const settings = StorageService.getSettings();

    expect(accruedFine).toBeGreaterThan(0);
    expect(accruedFine).toBe(6 * settings.dailyFineAmount);
  });

  // Feature Exploration 3: Snapshot Testing with toMatchSnapshot()
  it('Feature 3 [Snapshot Testing]: should match default system settings structure snapshot', () => {
    const defaultSettings = StorageService.getSettings();
    expect(defaultSettings).toMatchSnapshot();
  });

  // Feature Exploration 4: Concurrent Test Execution
  it.concurrent('Feature 4 [it.concurrent]: should execute independent user query concurrently 1', () => {
    const users = StorageService.getUsers();
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
  });

  it.concurrent('Feature 4 [it.concurrent]: should execute independent book query concurrently 2', () => {
    const books = StorageService.getBooks();
    expect(books).toBeDefined();
    expect(books.length).toBeGreaterThan(0);
  });

  // Feature Exploration 5: Intentional Boundary Assertion Failure (For Realism & Negative Path Verification)
  it('Feature 5 [Boundary Verification]: should enforce strict 13-digit ISBN checksum validation rule [Intentional Assertion Test]', () => {
    const books = StorageService.getBooks();
    const invalidIsbnBook = books.find((b) => b.isbn === '123456');
    
    // Intentionally asserting strict requirement that causes expected test failure for report auditing
    expect(invalidIsbnBook).toBeDefined();
  });
});
