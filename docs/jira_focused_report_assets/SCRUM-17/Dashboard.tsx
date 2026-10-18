import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { StorageService } from '../services/storage';

export const Dashboard: React.FC = () => {
  const { books, members, users, transactions, fines, returnBook, reservations, cancelReservation } = useLibrary();

  // Calculations
  const totalBooks = books.reduce((acc, curr) => acc + curr.totalCopies, 0);
  const checkedOutBooks = transactions.filter((t) => t.status === 'Issued').length;

  // Find overdue transactions
  const today = new Date();
  const overdueTransactions = transactions.filter((t) => {
    if (t.status !== 'Issued') return false;
    const due = new Date(t.dueDate);
    return today > due;
  });

  const overdueCount = overdueTransactions.length;

  // Unpaid fines + currently accrued fines on active overdue loans
  const unpaidFinesTotal = fines
    .filter((f) => f.paymentStatus === 'Unpaid')
    .reduce((acc, curr) => acc + curr.fineAmount, 0);

  const accruedActiveFines = transactions
    .filter((t) => t.status === 'Issued')
    .reduce((acc, curr) => acc + StorageService.calculateAccruedFine(curr), 0);

  const totalFinesValue = unpaidFinesTotal + accruedActiveFines;

  const handleQuickReturn = (txId: number) => {
    const res = returnBook(txId);
    if (res.success) {
      if (res.fineAmount > 0) {
        alert(`Book returned successfully! A fine of $${res.fineAmount.toFixed(2)} was charged for late return.`);
      } else {
        alert('Book returned successfully!');
      }
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  // Helper to find relations
  const getTransactionDetails = (txId: number) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return null;
    const book = books.find((b) => b.id === tx.bookId);
    const member = members.find((m) => m.id === tx.memberId);
    const user = member ? users.find((u) => u.id === member.userId) : null;
    return { tx, book, member, user };
  };

  // Find all active pending reservations
  const activeReservations = (reservations || [])
    .filter((r) => r.status === 'Pending')
    .map((r) => {
      const book = books.find((b) => b.id === r.bookId);
      const member = members.find((m) => m.id === r.memberId);
      const user = member ? users.find((u) => u.id === member.userId) : null;
      return {
        ...r,
        book,
        member,
        user,
      };
    });

  // Find paid fines ledger
  const paidFinesLedger = fines
    .filter((f) => f.paymentStatus === 'Paid')
    .map((f) => {
      const tx = transactions.find((t) => t.id === f.transactionId);
      const book = tx ? books.find((b) => b.id === tx.bookId) : null;
      const member = tx ? members.find((m) => m.id === tx.memberId) : null;
      const user = member ? users.find((u) => u.id === member.userId) : null;
      return {
        ...f,
        tx,
        book,
        member,
        user,
      };
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 4 Metric Cards Grid */}
      <div className="dashboard-grid">
        <div className="glass-panel metrics-card">
          <div className="metrics-icon">📚</div>
          <div className="metrics-info">
            <span className="metrics-val">{totalBooks}</span>
            <span className="metrics-label">Total Books Owned</span>
          </div>
        </div>

        <div className="glass-panel metrics-card" style={{ borderColor: 'var(--panel-border)' }}>
          <div className="metrics-icon" style={{ color: 'var(--secondary)' }}>🔄</div>
          <div className="metrics-info">
            <span className="metrics-val">{checkedOutBooks}</span>
            <span className="metrics-label">Active Loans</span>
          </div>
        </div>

        <div className="glass-panel metrics-card" style={{ borderColor: overdueCount > 0 ? 'rgba(239, 68, 68, 0.3)' : 'var(--panel-border)' }}>
          <div className="metrics-icon" style={{ color: overdueCount > 0 ? 'var(--danger)' : 'var(--warning)' }}>⚠️</div>
          <div className="metrics-info">
            <span className="metrics-val" style={{ color: overdueCount > 0 ? 'var(--danger)' : 'inherit' }}>
              {overdueCount}
            </span>
            <span className="metrics-label">Overdue Checkouts</span>
          </div>
        </div>

        <div className="glass-panel metrics-card">
          <div className="metrics-icon" style={{ color: 'var(--success)' }}>💳</div>
          <div className="metrics-info">
            <span className="metrics-val" style={{ color: totalFinesValue > 0 ? 'var(--danger)' : 'var(--success)' }}>
              ${totalFinesValue.toFixed(2)}
            </span>
            <span className="metrics-label">Outstanding Fines</span>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        {/* Overdue Ledger Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Overdue Returns Ledger</h3>
            <span className="badge badge-suspended">{overdueCount} Loans Overdue</span>
          </div>

          <div className="table-container">
            {overdueTransactions.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                🎉 Excellent! No book checkouts are currently overdue.
              </div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrower</th>
                    <th>Due Date</th>
                    <th>Elapsed</th>
                    <th>Accrued Fine</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueTransactions.map((tx) => {
                    const details = getTransactionDetails(tx.id);
                    if (!details) return null;
                    const accrued = StorageService.calculateAccruedFine(tx);
                    
                    const due = new Date(tx.dueDate);
                    const diffTime = Math.abs(today.getTime() - due.getTime());
                    const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    return (
                      <tr key={tx.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {details.book?.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ISBN: {details.book?.isbn}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{details.user?.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Card: {details.member?.cardNumber}
                          </div>
                        </td>
                        <td style={{ color: 'var(--danger)', fontWeight: 500 }}>
                          {tx.dueDate}
                        </td>
                        <td style={{ color: 'var(--warning)' }}>
                          {daysOverdue} days
                        </td>
                        <td style={{ color: 'var(--danger)', fontWeight: 600 }}>
                          ${accrued.toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleQuickReturn(tx.id)}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}
                          >
                            Return Book
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

        {/* Quick Reference Status */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Inventory Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {books.map((book) => {
              const checkedOut = book.totalCopies - book.availableCopies;
              const pct = book.totalCopies > 0 ? (checkedOut / book.totalCopies) * 100 : 0;
              return (
                <div key={book.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                      {book.title}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {book.availableCopies} / {book.totalCopies} Avail
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${100 - pct}%`, 
                        background: pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warning)' : 'var(--primary)',
                        borderRadius: '3px'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reservations Queue & Fine Payments Ledger */}
      <div className="dashboard-sections">
        
        {/* Book Reservations waitlists */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Active Reservations Waitlist</h3>
            <span className="badge badge-active">{activeReservations.length} Pending</span>
          </div>

          <div className="table-container">
            {activeReservations.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                🎟️ No pending book reservations at the moment.
              </div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Requester</th>
                    <th>Request Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeReservations.map((res) => (
                    <tr key={res.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {res.book?.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ISBN: {res.book?.isbn}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{res.user?.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Card: {res.member?.cardNumber}
                        </div>
                      </td>
                      <td>{res.requestDate}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            if (window.confirm('Cancel this reservation?')) {
                              cancelReservation(res.id);
                            }
                          }}
                          className="btn btn-danger"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
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

        {/* Fine Settlement History Log */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Fine Settlements Ledger</h3>
            <span className="badge badge-active" style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
              {paidFinesLedger.length} Paid Fines
            </span>
          </div>

          <div className="table-container">
            {paidFinesLedger.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                💳 No fines have been paid or logged yet.
              </div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrower</th>
                    <th>Amount Paid</th>
                    <th>Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paidFinesLedger.map((fine) => (
                    <tr key={fine.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                          {fine.book?.title}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{fine.user?.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Card: {fine.member?.cardNumber}
                        </div>
                      </td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                        ${fine.fineAmount.toFixed(2)}
                      </td>
                      <td>{fine.paidDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
