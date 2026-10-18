import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';

interface NavbarProps {
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { currentUser } = useAuth();
  const { resetDatabase } = useLibrary();

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'books':
        return 'Book Catalog & Inventory';
      case 'members':
        return 'Member Registry';
      case 'issues':
        return 'Loan Transactions';
      case 'my-loans':
        return 'My Borrowing Profile';
      default:
        return 'Library Management System';
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the database to original mock data? All current changes will be overwritten.')) {
      resetDatabase();
    }
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--panel-border)',
        paddingBottom: '1.25rem',
        marginBottom: '1rem',
      }}
    >
      <div>
        <h1 style={{ fontSize: '2rem', margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {getPageTitle()}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Welcome back, {currentUser?.fullName}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {currentUser?.role === 'Admin' && (
          <button onClick={handleReset} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 0.875rem' }}>
            🔄 Reset DB
          </button>
        )}
        <div
          className="badge"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--panel-border)',
            color: 'var(--text-secondary)',
            padding: '0.5rem 0.875rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            borderRadius: '8px',
          }}
        >
          🔑 Role: {currentUser?.role}
        </div>
      </div>
    </header>
  );
};
