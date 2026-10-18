import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User, StorageService } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, passwordHash: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: 'Admin' | 'Librarian' | 'Student' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem('lms_session');
    if (savedSession) {
      try {
        const sessionUser = JSON.parse(savedSession) as User;
        // Verify user still exists in storage
        const users = StorageService.getUsers();
        const found = users.find((u) => u.id === sessionUser.id && u.role === sessionUser.role);
        if (found) {
          setCurrentUser(found);
        } else {
          localStorage.removeItem('lms_session');
        }
      } catch {
        localStorage.removeItem('lms_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, passwordHash: string): Promise<{ success: boolean; error?: string }> => {
    // Artificial delay for realism
    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = StorageService.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Invalid email or password' };
    }

    setCurrentUser(user);
    localStorage.setItem('lms_session', JSON.stringify(user));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lms_session');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        userRole: currentUser ? currentUser.role : null,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
