import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';

export const MyLoans: React.FC = () => {
  const { books, members, transactions, fines, reservations, cancelReservation } = useLibrary();
  const { currentUser } = useAuth();

  // Find corresponding member profile
  const member = members.find((m) => m.userId === currentUser?.id);

  if (!member) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>No Membership Profile Found</h2>
        <p>Please contact a librarian to activate your library card account.</p>
      </div>
    );
  }

  // Current loans (Issued)
  const myActiveLoans = transactions
    .filter((t) => t.memberId === member.id && t.status === 'Issued')
    .map((t) => {
      const book = books.find((b) => b.id === t.bookId);
      return {
        ...t,
        book,
      };
    });

  // Past returns & transactions
  const myReturnHistory = transactions
    .filter((t) => t.memberId === member.id && t.status === 'Returned')
    .map((t) => {
      const book = books.find((b) => b.id === t.bookId);
      const fine = fines.find((f) => f.transactionId === t.id);
      return {
        ...t,
        book,
        fine,
      };
    });

  // Outstanding fines
  const myUnpaidFines = fines
    .filter((f) => {
      const tx = transactions.find((t) => t.id === f.transactionId);
      return tx && tx.memberId === member.id && f.paymentStatus === 'Unpaid';
    })
    .map((f) => {
      const tx = transactions.find((t) => t.id === f.transactionId);
      const book = tx ? books.find((b) => b.id === tx.bookId) : null;
      return {
        ...f,
        tx,
        book,
      };
    });

  // Pending reservations
  const myReservations = (reservations || [])
    .filter((r) => r.memberId === member.id && r.status === 'Pending')
    .map((r) => {
      const book = books.find((b) => b.id === r.bookId);
      return {
        ...r,
        book,
      };
    });

  // Calculate dynamic accrued fine
  const activeAccruedFine = myActiveLoans.reduce(
    (acc, curr) => acc + StorageService.calculateAccruedFine(curr),
    0
  );

  const unpaidFinesTotal = myUnpaidFines.reduce((acc, curr) => acc + curr.fineAmount, 0);
  const totalBalanceDue = unpaidFinesTotal + activeAccruedFine;

  const isActive = member.status === 'Active';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Profile Card & Info */}
      <div className="glass-panel profile-card">
        <div className="avatar avatar-large">
          {currentUser?.fullName.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="profile-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="profile-name">{currentUser?.fullName}</span>
            <span className={`badge ${isActive ? 'badge-active' : 'badge-suspended'}`}>
              {member.status} Account
            </span>
          </div>
          <span className="profile-email">{currentUser?.email}</span>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>💳 Card ID: **{member.cardNumber}**</span>
            <span>📅 Joined: {member.joinedDate}</span>
            <span>📚 Active Loans: **{member.booksCheckedOut} / 5**</span>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="dashboard-sections">
        {/* Active Checked Out Books */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>My Currently Checked Out Books</h3>

          <div className="table-container">
            {myActiveLoans.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                📖 You don't have any books checked out right now.
              </div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Date Borrowed</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Fine Accrued</th>
                  </tr>
                </thead>
                <tbody>
                  {myActiveLoans.map((loan) => {
                    const accrued = StorageService.calculateAccruedFine(loan);
                    const isOverdue = new Date() > new Date(loan.dueDate);
                    return (
                      <tr key={loan.id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {loan.book?.title}
                        </td>
                        <td>{loan.issueDate}</td>
                        <td style={{ color: isOverdue ? 'var(--danger)' : 'inherit', fontWeight: isOverdue ? 600 : 400 }}>
                          {loan.dueDate} {isOverdue && '(Overdue)'}
                        </td>
                        <td>
                          <span className={`badge ${isOverdue ? 'badge-suspended' : 'badge-active'}`}>
                            {isOverdue ? 'Overdue' : 'On Loan'}
                          </span>
                        </td>
                        <td style={{ color: accrued > 0 ? 'var(--danger)' : 'inherit', fontWeight: 600 }}>
                          ${accrued.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Financial Status */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Fees & Fine Overview</h3>

          <div
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              background: totalBalanceDue > 0 ? 'var(--danger-glow)' : 'var(--success-glow)',
              border: `1px solid ${totalBalanceDue > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>TOTAL BALANCE DUE</span>
            <span
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: totalBalanceDue > 0 ? 'var(--danger)' : 'var(--success)',
                fontFamily: 'var(--font-display)',
              }}
            >
              ${totalBalanceDue.toFixed(2)}
            </span>
            {totalBalanceDue > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Please visit the return desk to clear unpaid balances.
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Unpaid Fine Details</h4>
            {myUnpaidFines.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No unpaid fines. Clear standing!</p>
            ) : (
              myUnpaidFines.map((f) => (
                <div
                  key={f.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--panel-border)',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{f.book?.title}</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 600 }}>${f.fineAmount.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Book Reservations */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>My Book Reservations</h3>

        <div className="table-container">
          {myReservations.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              🎟️ You don't have any active book reservations.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>ISBN</th>
                  <th>Date Requested</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myReservations.map((res) => (
                  <tr key={res.id}>
                    <td style={{ fontWeight: 500 }}>{res.book?.title}</td>
                    <td>{res.book?.isbn}</td>
                    <td>{res.requestDate}</td>
                    <td>
                      <span className="badge badge-active" style={{ background: 'var(--primary-glow)', color: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        Waitlisted
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this reservation?')) {
                            cancelReservation(res.id);
                          }
                        }}
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Borrowing History */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Historical Borrowing Records</h3>

        <div className="table-container">
          {myReturnHistory.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              📅 You don't have any past library transactions.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Date Borrowed</th>
                  <th>Date Returned</th>
                  <th>Due Date</th>
                  <th>Fine Incurred</th>
                </tr>
              </thead>
              <tbody>
                {myReturnHistory.map((h) => (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 500 }}>{h.book?.title}</td>
                    <td>{h.issueDate}</td>
                    <td>{h.returnDate}</td>
                    <td>{h.dueDate}</td>
                    <td>
                      {h.fine ? (
                        <span style={{ color: h.fine.paymentStatus === 'Paid' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                          ${h.fine.fineAmount.toFixed(2)} ({h.fine.paymentStatus})
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
