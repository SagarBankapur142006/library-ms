export interface User {
  id: number;
  email: string;
  passwordHash: string; // Stored as plaintext/simple hash for mock purposes
  fullName: string;
  role: 'Admin' | 'Librarian' | 'Student';
  createdAt: string;
}

export interface Member {
  id: number;
  userId: number;
  cardNumber: string;
  status: 'Active' | 'Suspended';
  booksCheckedOut: number;
  joinedDate: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publisher: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
}

export interface Transaction {
  id: number;
  bookId: number;
  memberId: number;
  issuedByUserId: number;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'Issued' | 'Returned';
}

export interface Fine {
  id: number;
  transactionId: number;
  fineAmount: number;
  paymentStatus: 'Unpaid' | 'Paid';
  paidDate: string | null;
}

export interface SystemSettings {
  maxBooksAllowed: number;
  loanDurationDays: number;
  dailyFineAmount: number;
  suspensionFineLimit: number;
}

export interface Reservation {
  id: number;
  bookId: number;
  memberId: number;
  requestDate: string;
  status: 'Pending' | 'Fulfilled' | 'Cancelled';
}

// Database state schema
interface DBState {
  users: User[];
  members: Member[];
  books: Book[];
  transactions: Transaction[];
  fines: Fine[];
  settings: SystemSettings;
  reservations: Reservation[];
}

const STORAGE_KEY = 'lms_database';

// Helper to get today's date offset by days
const getDateOffset = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const defaultState: DBState = {
  users: [
    {
      id: 1,
      email: 'admin@library.com',
      passwordHash: 'admin123',
      fullName: 'Chief Administrator',
      role: 'Admin',
      createdAt: getDateOffset(-180),
    },
    {
      id: 2,
      email: 'librarian@library.com',
      passwordHash: 'lib123',
      fullName: 'Sarah Jenkins',
      role: 'Librarian',
      createdAt: getDateOffset(-120),
    },
    {
      id: 3,
      email: 'student1@library.com',
      passwordHash: 'student123',
      fullName: 'John Doe',
      role: 'Student',
      createdAt: getDateOffset(-90),
    },
    {
      id: 4,
      email: 'student2@library.com',
      passwordHash: 'student123',
      fullName: 'Jane Smith',
      role: 'Student',
      createdAt: getDateOffset(-60),
    },
    {
      id: 5,
      email: 'student3@library.com',
      passwordHash: 'student123',
      fullName: 'Alice Johnson',
      role: 'Student',
      createdAt: getDateOffset(-45),
    },
  ],
  members: [
    {
      id: 1,
      userId: 3,
      cardNumber: 'LMC-001',
      status: 'Active',
      booksCheckedOut: 1,
      joinedDate: getDateOffset(-90),
    },
    {
      id: 2,
      userId: 4,
      cardNumber: 'LMC-002',
      status: 'Active',
      booksCheckedOut: 0,
      joinedDate: getDateOffset(-60),
    },
    {
      id: 3,
      userId: 5,
      cardNumber: 'LMC-003',
      status: 'Suspended',
      booksCheckedOut: 1,
      joinedDate: getDateOffset(-45),
    },
  ],
  books: [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      genre: 'Fiction',
      publisher: 'Scribner',
      publicationYear: 1925,
      totalCopies: 3,
      availableCopies: 3,
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '9780446310789',
      genre: 'Fiction',
      publisher: 'Grand Central Publishing',
      publicationYear: 1960,
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      id: 3,
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      isbn: '9780553380163',
      genre: 'Science',
      publisher: 'Bantam Books',
      publicationYear: 1988,
      totalCopies: 2,
      availableCopies: 2,
    },
    {
      id: 4,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      genre: 'Technology',
      publisher: 'Prentice Hall',
      publicationYear: 2008,
      totalCopies: 5,
      availableCopies: 4, // 1 checked out by John Doe
    },
    {
      id: 5,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '9780345339683',
      genre: 'Fantasy',
      publisher: 'Ballantine Books',
      publicationYear: 1937,
      totalCopies: 3,
      availableCopies: 2, // 1 checked out (overdue) by Alice Johnson
    },
  ],
  transactions: [
    {
      id: 1,
      bookId: 4,
      memberId: 1, // John Doe
      issuedByUserId: 2, // Sarah Jenkins
      issueDate: getDateOffset(-5),
      dueDate: getDateOffset(9),
      returnDate: null,
      status: 'Issued',
    },
    {
      id: 2,
      bookId: 1, // The Great Gatsby
      memberId: 2, // Jane Smith
      issuedByUserId: 2,
      issueDate: getDateOffset(-20),
      dueDate: getDateOffset(-6), // Overdue by 6 days on return
      returnDate: getDateOffset(-2),
      status: 'Returned',
    },
    {
      id: 3,
      bookId: 5, // The Hobbit
      memberId: 3, // Alice Johnson
      issuedByUserId: 2,
      issueDate: getDateOffset(-25),
      dueDate: getDateOffset(-11), // Overdue by 11 days (no return yet)
      returnDate: null,
      status: 'Issued',
    },
  ],
  fines: [
    {
      id: 1,
      transactionId: 2, // Jane Smith (Returned late)
      fineAmount: 6.0, // 6 days overdue * $1.00
      paymentStatus: 'Paid',
      paidDate: getDateOffset(-2),
    },
    // John Doe has no fine because not overdue yet
    // Alice Johnson has a dynamic fine of $11.00 but let's record it as Unpaid in DB
    {
      id: 2,
      transactionId: 3, // Alice Johnson
      fineAmount: 11.0,
      paymentStatus: 'Unpaid',
      paidDate: null,
    },
  ],
  settings: {
    maxBooksAllowed: 5,
    loanDurationDays: 14,
    dailyFineAmount: 1.0,
    suspensionFineLimit: 10.0,
  },
  reservations: [],
};

// Database class helper
export class StorageService {
  private static loadState(): DBState {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.saveState(defaultState);
      return defaultState;
    }
    try {
      const state = JSON.parse(data);
      if (!state.settings) {
        state.settings = { ...defaultState.settings };
      }
      if (!state.reservations) {
        state.reservations = [];
      }
      return state;
    } catch {
      this.saveState(defaultState);
      return defaultState;
    }
  }

  private static saveState(state: DBState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // Clear state and re-initialize
  public static resetState(): void {
    this.saveState(defaultState);
  }

  // --- USERS ---
  public static getUsers(): User[] {
    return this.loadState().users;
  }

  public static saveUser(user: User): void {
    const state = this.loadState();
    const index = state.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      state.users[index] = user;
    } else {
      state.users.push(user);
    }
    this.saveState(state);
  }

  public static deleteUser(id: number): void {
    const state = this.loadState();
    state.users = state.users.filter((u) => u.id !== id);
    state.members = state.members.filter((m) => m.userId !== id);
    this.saveState(state);
  }

  // --- MEMBERS ---
  public static getMembers(): Member[] {
    return this.loadState().members;
  }

  public static saveMember(member: Member): void {
    const state = this.loadState();
    const index = state.members.findIndex((m) => m.id === member.id);
    if (index >= 0) {
      state.members[index] = member;
    } else {
      state.members.push(member);
    }
    this.saveState(state);
  }

  // --- BOOKS ---
  public static getBooks(): Book[] {
    return this.loadState().books;
  }

  public static saveBook(book: Book): void {
    const state = this.loadState();
    const index = state.books.findIndex((b) => b.id === book.id);
    if (index >= 0) {
      state.books[index] = book;
    } else {
      state.books.push(book);
    }
    this.saveState(state);
  }

  public static deleteBook(id: number): boolean {
    const state = this.loadState();
    // Check if copies are currently issued
    const activeIssues = state.transactions.some(
      (t) => t.bookId === id && t.status === 'Issued'
    );
    if (activeIssues) {
      return false; // Restrict delete
    }
    state.books = state.books.filter((b) => b.id !== id);
    this.saveState(state);
    return true;
  }

  // --- TRANSACTIONS ---
  public static getTransactions(): Transaction[] {
    return this.loadState().transactions;
  }

  // Helper to issue a book
  public static issueBook(bookId: number, memberId: number, issuedByUserId: number): { success: boolean; error?: string } {
    const state = this.loadState();
    const bookIndex = state.books.findIndex((b) => b.id === bookId);
    const memberIndex = state.members.findIndex((m) => m.id === memberId);

    if (bookIndex === -1) return { success: false, error: 'Book not found' };
    if (memberIndex === -1) return { success: false, error: 'Member not found' };

    const book = state.books[bookIndex];
    const member = state.members[memberIndex];

    if (book.availableCopies <= 0) {
      return { success: false, error: 'No copies available' };
    }

    if (member.status === 'Suspended') {
      return { success: false, error: 'Member is suspended' };
    }

    const settings = state.settings || { maxBooksAllowed: 5, loanDurationDays: 14, dailyFineAmount: 1.0, suspensionFineLimit: 10.0 };

    if (member.booksCheckedOut >= settings.maxBooksAllowed) {
      return { success: false, error: `Member borrowing limit reached (Max ${settings.maxBooksAllowed} books)` };
    }

    // Update book & member count
    book.availableCopies -= 1;
    member.booksCheckedOut += 1;

    // Create transaction
    const newTxId = state.transactions.length > 0 ? Math.max(...state.transactions.map(t => t.id)) + 1 : 1;
    const issueDate = new Date().toISOString().split('T')[0];
    const dueDate = getDateOffset(settings.loanDurationDays);

    const newTransaction: Transaction = {
      id: newTxId,
      bookId,
      memberId,
      issuedByUserId,
      issueDate,
      dueDate,
      returnDate: null,
      status: 'Issued',
    };

    state.transactions.push(newTransaction);

    // Fulfill reservation if exists
    const resIndex = state.reservations.findIndex(
      (r) => r.bookId === bookId && r.memberId === memberId && r.status === 'Pending'
    );
    if (resIndex !== -1) {
      state.reservations[resIndex].status = 'Fulfilled';
    }

    this.saveState(state);
    return { success: true };
  }

  // Helper to return a book
  public static returnBook(transactionId: number): { success: boolean; fineAmount: number; error?: string } {
    const state = this.loadState();
    const txIndex = state.transactions.findIndex((t) => t.id === transactionId);

    if (txIndex === -1) return { success: false, fineAmount: 0, error: 'Transaction not found' };

    const transaction = state.transactions[txIndex];
    if (transaction.status === 'Returned') {
      return { success: false, fineAmount: 0, error: 'Book already returned' };
    }

    const bookIndex = state.books.findIndex((b) => b.id === transaction.bookId);
    const memberIndex = state.members.findIndex((m) => m.id === transaction.memberId);

    if (bookIndex !== -1) {
      state.books[bookIndex].availableCopies = Math.min(
        state.books[bookIndex].totalCopies,
        state.books[bookIndex].availableCopies + 1
      );
    }

    if (memberIndex !== -1) {
      state.members[memberIndex].booksCheckedOut = Math.max(
        0,
        state.members[memberIndex].booksCheckedOut - 1
      );
    }

    const returnDate = new Date().toISOString().split('T')[0];
    transaction.returnDate = returnDate;
    transaction.status = 'Returned';

    const settings = state.settings || { maxBooksAllowed: 5, loanDurationDays: 14, dailyFineAmount: 1.0, suspensionFineLimit: 10.0 };

    // Calculate fine if overdue
    let fineAmount = 0;
    const due = new Date(transaction.dueDate);
    const ret = new Date(returnDate);

    if (ret > due) {
      const diffTime = Math.abs(ret.getTime() - due.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = diffDays * settings.dailyFineAmount;
    }

    if (fineAmount > 0) {
      const fineId = state.fines.length > 0 ? Math.max(...state.fines.map(f => f.id)) + 1 : 1;
      const newFine: Fine = {
        id: fineId,
        transactionId,
        fineAmount,
        paymentStatus: 'Unpaid',
        paidDate: null,
      };
      state.fines.push(newFine);

      // Auto-suspend member if they exceed borrowing conditions or have a fine of >= suspensionFineLimit
      if (memberIndex !== -1 && fineAmount >= settings.suspensionFineLimit) {
        state.members[memberIndex].status = 'Suspended';
      }
    }

    this.saveState(state);
    return { success: true, fineAmount };
  }

  // --- FINES ---
  public static getFines(): Fine[] {
    return this.loadState().fines;
  }

  public static payFine(fineId: number): boolean {
    const state = this.loadState();
    const fineIndex = state.fines.findIndex((f) => f.id === fineId);
    if (fineIndex === -1) return false;

    state.fines[fineIndex].paymentStatus = 'Paid';
    state.fines[fineIndex].paidDate = new Date().toISOString().split('T')[0];

    // Check if the member has any other outstanding fines
    const fine = state.fines[fineIndex];
    const tx = state.transactions.find((t) => t.id === fine.transactionId);
    if (tx) {
      const memberId = tx.memberId;
      const unpaidFines = state.fines.filter((f) => {
        const fTx = state.transactions.find((t) => t.id === f.transactionId);
        return fTx && fTx.memberId === memberId && f.paymentStatus === 'Unpaid' && f.id !== fineId;
      });

      // If no other unpaid fines, reactivate member status
      if (unpaidFines.length === 0) {
        const memberIndex = state.members.findIndex((m) => m.id === memberId);
        if (memberIndex !== -1) {
          state.members[memberIndex].status = 'Active';
        }
      }
    }

    this.saveState(state);
    return true;
  }

  // Helper to dynamically calculate current accrued fine (for active issued loans)
  public static calculateAccruedFine(transaction: Transaction): number {
    if (transaction.status === 'Returned') {
      return 0; // Handled by recorded fine
    }
    const due = new Date(transaction.dueDate);
    const today = new Date();
    if (today > due) {
      const diffTime = Math.abs(today.getTime() - due.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const settings = this.getSettings();
      return diffDays * settings.dailyFineAmount;
    }
    return 0;
  }

  // --- SETTINGS ---
  public static getSettings(): SystemSettings {
    const state = this.loadState();
    return state.settings || { maxBooksAllowed: 5, loanDurationDays: 14, dailyFineAmount: 1.0, suspensionFineLimit: 10.0 };
  }

  public static updateSettings(settings: SystemSettings): void {
    const state = this.loadState();
    state.settings = settings;
    this.saveState(state);
  }

  // --- RESERVATIONS ---
  public static getReservations(): Reservation[] {
    const state = this.loadState();
    return state.reservations || [];
  }

  public static reserveBook(bookId: number, memberId: number): { success: boolean; error?: string } {
    const state = this.loadState();
    const book = state.books.find((b) => b.id === bookId);
    const member = state.members.find((m) => m.id === memberId);

    if (!book) return { success: false, error: 'Book not found' };
    if (!member) return { success: false, error: 'Member not found' };

    if (member.status === 'Suspended') {
      return { success: false, error: 'Member is suspended' };
    }

    // Check if member already has checked out this book
    const hasActiveCheckout = state.transactions.some(
      (t) => t.bookId === bookId && t.memberId === memberId && t.status === 'Issued'
    );
    if (hasActiveCheckout) {
      return { success: false, error: 'You already have this book checked out.' };
    }

    // Check if member already has a pending reservation for this book
    const hasActiveReservation = (state.reservations || []).some(
      (r) => r.bookId === bookId && r.memberId === memberId && r.status === 'Pending'
    );
    if (hasActiveReservation) {
      return { success: false, error: 'You already have a pending reservation for this book.' };
    }

    const nextId = (state.reservations || []).length > 0 ? Math.max(...state.reservations.map((r) => r.id)) + 1 : 1;
    const newReservation: Reservation = {
      id: nextId,
      bookId,
      memberId,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    if (!state.reservations) {
      state.reservations = [];
    }
    state.reservations.push(newReservation);
    this.saveState(state);
    return { success: true };
  }

  public static cancelReservation(reservationId: number): boolean {
    const state = this.loadState();
    if (!state.reservations) return false;
    const resIndex = state.reservations.findIndex((r) => r.id === reservationId);
    if (resIndex === -1) return false;

    state.reservations[resIndex].status = 'Cancelled';
    this.saveState(state);
    return true;
  }
}
