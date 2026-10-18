import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type Book, type Member, type Transaction, type Fine, type User, type SystemSettings, type Reservation, StorageService } from '../services/storage';

interface LibraryContextType {
  books: Book[];
  members: Member[];
  users: User[];
  transactions: Transaction[];
  fines: Fine[];
  settings: SystemSettings | null;
  reservations: Reservation[];
  refreshData: () => void;
  addBook: (bookData: Omit<Book, 'id' | 'availableCopies'>) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: number) => { success: boolean; error?: string };
  registerMember: (fullName: string, email: string, cardNumber: string) => { success: boolean; error?: string };
  updateMemberStatus: (id: number, status: 'Active' | 'Suspended') => void;
  issueBook: (bookId: number, memberId: number, librarianId: number) => { success: boolean; error?: string };
  returnBook: (transactionId: number) => { success: boolean; fineAmount: number; error?: string };
  payFine: (fineId: number) => boolean;
  resetDatabase: () => void;
  updateSettings: (settings: SystemSettings) => void;
  reserveBook: (bookId: number, memberId: number) => { success: boolean; error?: string };
  cancelReservation: (reservationId: number) => boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const refreshData = useCallback(() => {
    setBooks(StorageService.getBooks());
    setMembers(StorageService.getMembers());
    setUsers(StorageService.getUsers());
    setTransactions(StorageService.getTransactions());
    setFines(StorageService.getFines());
    setSettings(StorageService.getSettings());
    setReservations(StorageService.getReservations());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addBook = (bookData: Omit<Book, 'id' | 'availableCopies'>) => {
    const allBooks = StorageService.getBooks();
    const newId = allBooks.length > 0 ? Math.max(...allBooks.map((b) => b.id)) + 1 : 1;
    const newBook: Book = {
      ...bookData,
      id: newId,
      availableCopies: bookData.totalCopies,
    };
    StorageService.saveBook(newBook);
    refreshData();
  };

  const updateBook = (book: Book) => {
    // Keep available copies adjusted relative to any total copy changes if needed
    const prevBooks = StorageService.getBooks();
    const prevBook = prevBooks.find((b) => b.id === book.id);
    let availableCopies = book.availableCopies;
    if (prevBook) {
      const diff = book.totalCopies - prevBook.totalCopies;
      availableCopies = Math.max(0, prevBook.availableCopies + diff);
    }
    const updatedBook = { ...book, availableCopies };
    StorageService.saveBook(updatedBook);
    refreshData();
  };

  const deleteBook = (id: number): { success: boolean; error?: string } => {
    const success = StorageService.deleteBook(id);
    if (success) {
      refreshData();
      return { success: true };
    }
    return { success: false, error: 'Cannot delete book as it has active checkout transactions.' };
  };

  const registerMember = (fullName: string, email: string, cardNumber: string): { success: boolean; error?: string } => {
    const allUsers = StorageService.getUsers();
    if (allUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered.' };
    }

    const allMembers = StorageService.getMembers();
    if (allMembers.some((m) => m.cardNumber.toLowerCase() === cardNumber.toLowerCase())) {
      return { success: false, error: 'Library card number already exists.' };
    }

    // 1. Create User
    const nextUserId = allUsers.length > 0 ? Math.max(...allUsers.map((u) => u.id)) + 1 : 1;
    const newUser: User = {
      id: nextUserId,
      email,
      passwordHash: 'student123', // Default password
      fullName,
      role: 'Student',
      createdAt: new Date().toISOString().split('T')[0],
    };
    StorageService.saveUser(newUser);

    // 2. Create Member linked to User
    const nextMemberId = allMembers.length > 0 ? Math.max(...allMembers.map((m) => m.id)) + 1 : 1;
    const newMember: Member = {
      id: nextMemberId,
      userId: nextUserId,
      cardNumber,
      status: 'Active',
      booksCheckedOut: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    StorageService.saveMember(newMember);

    refreshData();
    return { success: true };
  };

  const updateMemberStatus = (id: number, status: 'Active' | 'Suspended') => {
    const member = members.find((m) => m.id === id);
    if (member) {
      const updatedMember = { ...member, status };
      StorageService.saveMember(updatedMember);
      refreshData();
    }
  };

  const issueBook = (bookId: number, memberId: number, librarianId: number): { success: boolean; error?: string } => {
    const res = StorageService.issueBook(bookId, memberId, librarianId);
    if (res.success) {
      refreshData();
    }
    return res;
  };

  const returnBook = (transactionId: number): { success: boolean; fineAmount: number; error?: string } => {
    const res = StorageService.returnBook(transactionId);
    if (res.success) {
      refreshData();
    }
    return res;
  };

  const payFine = (fineId: number): boolean => {
    const res = StorageService.payFine(fineId);
    if (res) {
      refreshData();
    }
    return res;
  };

  const resetDatabase = () => {
    StorageService.resetState();
    refreshData();
  };

  const updateSettings = (newSettings: SystemSettings) => {
    StorageService.updateSettings(newSettings);
    refreshData();
  };

  const reserveBook = (bookId: number, memberId: number) => {
    const res = StorageService.reserveBook(bookId, memberId);
    if (res.success) {
      refreshData();
    }
    return res;
  };

  const cancelReservation = (reservationId: number) => {
    const res = StorageService.cancelReservation(reservationId);
    if (res) {
      refreshData();
    }
    return res;
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        members,
        users,
        transactions,
        fines,
        settings,
        reservations,
        refreshData,
        addBook,
        updateBook,
        deleteBook,
        registerMember,
        updateMemberStatus,
        issueBook,
        returnBook,
        payFine,
        resetDatabase,
        updateSettings,
        reserveBook,
        cancelReservation,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
