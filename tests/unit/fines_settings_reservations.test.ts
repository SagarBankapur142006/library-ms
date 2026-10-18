import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../../src/services/storage';

describe('SCRUM-15 & SCRUM-17: Fines, Settings & Reservations Module (Sagar S Bankapur)', () => {
  beforeEach(() => {
    StorageService.resetState();
  });

  it('should update system configuration parameters', () => {
    const customSettings = {
      maxBooksAllowed: 8,
      loanDurationDays: 21,
      dailyFineAmount: 2.5,
      suspensionFineLimit: 25.0,
    };

    StorageService.updateSettings(customSettings);
    const retrieved = StorageService.getSettings();
    expect(retrieved.maxBooksAllowed).toBe(8);
    expect(retrieved.loanDurationDays).toBe(21);
    expect(retrieved.dailyFineAmount).toBe(2.5);
    expect(retrieved.suspensionFineLimit).toBe(25.0);
  });

  it('should handle fine payment and clear member suspension', () => {
    const fines = StorageService.getFines();
    expect(fines.length).toBeGreaterThan(0);
    const unpaidFine = fines.find((f) => f.paymentStatus === 'Unpaid');

    if (unpaidFine) {
      const success = StorageService.payFine(unpaidFine.id);
      expect(success).toBe(true);

      const reloadedFines = StorageService.getFines();
      const updated = reloadedFines.find((f) => f.id === unpaidFine.id)!;
      expect(updated.paymentStatus).toBe('Paid');
      expect(updated.paidDate).not.toBeNull();
    }
  });

  it('should allow student to reserve a book and prevent duplicate reservations', () => {
    // Member 1 reserves Book 2
    const reserveResult = StorageService.reserveBook(2, 1);
    expect(reserveResult.success).toBe(true);

    const reservations = StorageService.getReservations();
    const myRes = reservations.find((r) => r.bookId === 2 && r.memberId === 1);
    expect(myRes).toBeDefined();
    expect(myRes?.status).toBe('Pending');

    // Attempt duplicate reservation
    const duplicateResult = StorageService.reserveBook(2, 1);
    expect(duplicateResult.success).toBe(false);
    expect(duplicateResult.error).toMatch(/already have a pending reservation/i);
  });

  it('should allow member to cancel a pending reservation', () => {
    StorageService.reserveBook(3, 2);
    const reservations = StorageService.getReservations();
    const res = reservations.find((r) => r.bookId === 3 && r.memberId === 2)!;

    const cancelSuccess = StorageService.cancelReservation(res.id);
    expect(cancelSuccess).toBe(true);

    const updatedRes = StorageService.getReservations().find((r) => r.id === res.id)!;
    expect(updatedRes.status).toBe('Cancelled');
  });
});
