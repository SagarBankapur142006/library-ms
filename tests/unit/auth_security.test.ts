import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService, type User } from '../../src/services/storage';

// Helper simulating auth verification logic in AuthContext
function verifyUserLogin(email: string, passwordHash: string): { success: boolean; user?: User; error?: string } {
  const users = StorageService.getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }
  if (user.passwordHash !== passwordHash) {
    return { success: false, error: 'Invalid email or password' };
  }
  return { success: true, user };
}

describe('SCRUM-8 & SCRUM-13: Authentication & Security Module (Sagar S Bankapur)', () => {
  beforeEach(() => {
    StorageService.resetState();
  });

  it('should authenticate Admin user with valid credentials', () => {
    const result = verifyUserLogin('admin@library.com', 'admin123');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.role).toBe('Admin');
    expect(result.user?.fullName).toBe('Chief Administrator');
  });

  it('should authenticate Librarian with valid credentials', () => {
    const result = verifyUserLogin('librarian@library.com', 'lib123');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.role).toBe('Librarian');
  });

  it('should authenticate Student with valid credentials', () => {
    const result = verifyUserLogin('student1@library.com', 'student123');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.role).toBe('Student');
  });

  it('should reject authentication when password is incorrect', () => {
    const result = verifyUserLogin('admin@library.com', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');
    expect(result.user).toBeUndefined();
  });

  it('should reject authentication for non-existent email', () => {
    const result = verifyUserLogin('unknown@vit.ac.in', 'password123');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');
  });

  it('should persist and retrieve seeded users list', () => {
    const users = StorageService.getUsers();
    expect(users.length).toBeGreaterThanOrEqual(3);
    const emails = users.map((u) => u.email);
    expect(emails).toContain('admin@library.com');
    expect(emails).toContain('librarian@library.com');
    expect(emails).toContain('student1@library.com');
  });

  it('should allow adding a new user and saving changes', () => {
    const initialUsers = StorageService.getUsers();
    const newUser: User = {
      id: 99,
      email: 'newstudent@vitstudent.ac.in',
      passwordHash: 'newpass123',
      fullName: 'New Student Test',
      role: 'Student',
      createdAt: '2026-08-01',
    };
    StorageService.saveUser(newUser);

    const reloaded = StorageService.getUsers();
    expect(reloaded.length).toBe(initialUsers.length + 1);
    const found = reloaded.find((u) => u.email === 'newstudent@vitstudent.ac.in');
    expect(found).toBeDefined();
    expect(found?.fullName).toBe('New Student Test');
  });
});
