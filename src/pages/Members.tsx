import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

export const Members: React.FC = () => {
  const { members, users, registerMember, updateMemberStatus } = useLibrary();

  // Search & Modal state
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = () => {
    setFullName('');
    setEmail('');
    // Auto-generate card number
    const count = members.length + 1;
    setCardNumber(`LMC-${String(count).padStart(3, '0')}`);
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !cardNumber) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    const res = registerMember(fullName, email, cardNumber);
    if (res.success) {
      setIsModalOpen(false);
    } else {
      setError(res.error || 'Failed to register member.');
    }
  };

  const toggleStatus = (memberId: number, currentStatus: 'Active' | 'Suspended') => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    const msg = `Are you sure you want to change this member's status to ${nextStatus}?`;
    if (window.confirm(msg)) {
      updateMemberStatus(memberId, nextStatus);
    }
  };

  // Resolve user details for members
  const membersWithUsers = members.map((m) => {
    const user = users.find((u) => u.id === m.userId);
    return {
      ...m,
      user,
    };
  });

  const filteredMembers = membersWithUsers.filter((m) => {
    const nameMatch = m.user?.fullName.toLowerCase().includes(search.toLowerCase()) || false;
    const emailMatch = m.user?.email.toLowerCase().includes(search.toLowerCase()) || false;
    const cardMatch = m.cardNumber.toLowerCase().includes(search.toLowerCase());
    return nameMatch || emailMatch || cardMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Search and Action */}
      <div className="glass-panel search-bar-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input"
            placeholder="Search members by name, email, or library card..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button onClick={handleOpenModal} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          ➕ Register Member
        </button>
      </div>

      {/* Member Table */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem' }}>Registered Cardholders</h3>
        
        <div className="table-container">
          {filteredMembers.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              👥 No library members found.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Cardholder</th>
                  <th>Card ID</th>
                  <th>Status</th>
                  <th>Books Checked Out</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => {
                  const isActive = m.status === 'Active';
                  return (
                    <tr key={m.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="avatar">
                            {m.user?.fullName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {m.user?.fullName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {m.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>
                        {m.cardNumber}
                      </td>
                      <td>
                        <span className={`badge ${isActive ? 'badge-active' : 'badge-suspended'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>
                        {m.booksCheckedOut} / 5
                      </td>
                      <td>
                        {m.joinedDate}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => toggleStatus(m.id, m.status)}
                          className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`}
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.4rem 0.8rem',
                            color: isActive ? 'var(--danger)' : 'white',
                            borderColor: isActive ? 'rgba(239, 68, 68, 0.3)' : 'transparent',
                            background: isActive ? 'var(--danger-glow)' : 'var(--success)'
                          }}
                        >
                          {isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Register New Cardholder</h2>

            {error && (
              <div
                style={{
                  background: 'var(--danger-glow)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: 'var(--danger)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  required
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="form-label">Library Card Number (Auto-Generated) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="LMC-000"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
