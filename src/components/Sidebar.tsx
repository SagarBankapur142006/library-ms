import React from 'react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { logout, currentUser, userRole } = useAuth();

  const getNavLinks = () => {
    const links = [];

    // All roles can search books
    links.push({ id: 'books', label: 'Book Catalog', icon: '📚' });

    if (userRole === 'Admin' || userRole === 'Librarian') {
      links.unshift({ id: 'dashboard', label: 'Dashboard', icon: '📊' });
      links.push({ id: 'members', label: 'Manage Members', icon: '👥' });
    }

    if (userRole === 'Librarian') {
      links.push({ id: 'issues', label: 'Checkouts & Returns', icon: '🔄' });
    }

    if (userRole === 'Admin') {
      links.push({ id: 'settings', label: 'System Settings', icon: '⚙️' });
    }

    if (userRole === 'Student') {
      links.push({ id: 'my-loans', label: 'My Loans & Fines', icon: '💳' });
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">L</div>
        <div className="brand-name">AthenaLMS</div>
      </div>

      <nav style={{ flexGrow: 1, marginTop: '1rem' }}>
        {navLinks.map((link) => (
          <div
            key={link.id}
            onClick={() => setCurrentPage(link.id)}
            className={`nav-link ${currentPage === link.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem', marginTop: 'auto' }}>
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="avatar">
              {currentUser.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.fullName}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {currentUser.role}
              </span>
            </div>
          </div>
        )}

        <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', gap: '0.75rem' }}>
          <span>🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};
