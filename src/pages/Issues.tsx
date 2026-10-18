import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';

export const Issues: React.FC = () => {
  const { books, members, users, transactions, fines, issueBook, returnBook, payFine } = useLibrary();
  const { currentUser } = useAuth();

  // Selected tab
  const [activeTab, setActiveTab] = useState<'checkout' | 'returns' | 'fines'>('checkout');

  // Checkout form state
  const [selectedBookId, setSelectedBookId] = useState<number | ''>('');
  const [selectedMemberId, setSelectedMemberId] = useState<number | ''>('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

  // Search filters
  const [txSearch, setTxSearch] = useState('');
  const [fineSearch, setFineSearch] = useState('');

  // Razorpay Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingFineItem, setPendingFineItem] = useState<{ id: number; amount: number; memberName: string; bookTitle: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<{ transactionId: string; amount: number; date: string } | null>(null);

  const activeBooks = books.filter((b) => b.availableCopies > 0);
  const activeMembers = members.filter((m) => m.status === 'Active' && m.booksCheckedOut < 5);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedMemberId) {
      setCheckoutError('Please select both a book and a cardholder.');
      return;
    }

    if (!currentUser) {
      setCheckoutError('Librarian details not found. Please log in.');
      return;
    }

    setCheckoutError(null);
    setCheckoutSuccess(false);

    const res = issueBook(Number(selectedBookId), Number(selectedMemberId), currentUser.id);
    if (res.success) {
      setCheckoutSuccess(true);
      setSelectedBookId('');
      setSelectedMemberId('');
      setTimeout(() => setCheckoutSuccess(false), 3000);
    } else {
      setCheckoutError(res.error || 'Failed to issue book');
    }
  };

  const handleReturn = (txId: number) => {
    if (window.confirm('Process book return for this transaction?')) {
      const res = returnBook(txId);
      if (res.success) {
        if (res.fineAmount > 0) {
          alert(`Return processed! Member was charged a fine of $${res.fineAmount.toFixed(2)} due to overdue return.`);
        } else {
          alert('Return processed successfully!');
        }
      } else {
        alert(`Error returning book: ${res.error}`);
      }
    }
  };

  const handleOpenPaymentModal = (fineId: number, amount: number, memberName: string, bookTitle: string) => {
    setPendingFineItem({ id: fineId, amount, memberName, bookTitle });
    setPaymentModalOpen(true);
    setPaymentReceipt(null);
  };

  const handleConfirmRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFineItem) return;

    setPaymentProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = payFine(pendingFineItem.id);
    setPaymentProcessing(false);

    if (success) {
      const receiptId = 'RZP_' + Math.random().toString(36).substring(2, 9).toUpperCase();
      setPaymentReceipt({
        transactionId: receiptId,
        amount: pendingFineItem.amount,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
      setTimeout(() => {
        setPaymentModalOpen(false);
        setPendingFineItem(null);
      }, 1500);
    } else {
      alert('Failed to process fine payment.');
    }
  };

  // Resolve transactions list
  const resolvedTransactions = transactions.map((t) => {
    const book = books.find((b) => b.id === t.bookId);
    const member = members.find((m) => m.id === t.memberId);
    const memberUser = member ? users.find((u) => u.id === member.userId) : null;
    const staff = users.find((u) => u.id === t.issuedByUserId);

    return {
      ...t,
      book,
      member,
      memberUser,
      staff,
    };
  });

  // Resolve fines list
  const resolvedFines = fines.map((f) => {
    const tx = transactions.find((t) => t.id === f.transactionId);
    const book = tx ? books.find((b) => b.id === tx.bookId) : null;
    const member = tx ? members.find((m) => m.id === tx.memberId) : null;
    const memberUser = member ? users.find((u) => u.id === member.userId) : null;

    return {
      ...f,
      tx,
      book,
      member,
      memberUser,
    };
  });

  // Filters
  const filteredActiveTransactions = resolvedTransactions
    .filter((t) => t.status === 'Issued')
    .filter((t) => {
      const bookTitle = t.book?.title.toLowerCase() || '';
      const cardholder = t.memberUser?.fullName.toLowerCase() || '';
      const card = t.member?.cardNumber.toLowerCase() || '';
      const query = txSearch.toLowerCase();
      return bookTitle.includes(query) || cardholder.includes(query) || card.includes(query);
    });

  const filteredFines = resolvedFines.filter((f) => {
    const cardholder = f.memberUser?.fullName.toLowerCase() || '';
    const card = f.member?.cardNumber.toLowerCase() || '';
    const query = fineSearch.toLowerCase();
    return cardholder.includes(query) || card.includes(query);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--panel-border)', gap: '1rem' }}>
        <button
          onClick={() => setActiveTab('checkout')}
          className={`nav-link ${activeTab === 'checkout' ? 'active' : ''}`}
          style={{ borderBottom: activeTab === 'checkout' ? '2px solid var(--primary)' : 'none', borderRadius: '8px 8px 0 0', margin: 0 }}
        >
          📤 Issue Checkout
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`nav-link ${activeTab === 'returns' ? 'active' : ''}`}
          style={{ borderBottom: activeTab === 'returns' ? '2px solid var(--primary)' : 'none', borderRadius: '8px 8px 0 0', margin: 0 }}
        >
          📥 Return Desk
        </button>
        <button
          onClick={() => setActiveTab('fines')}
          className={`nav-link ${activeTab === 'fines' ? 'active' : ''}`}
          style={{ borderBottom: activeTab === 'fines' ? '2px solid var(--primary)' : 'none', borderRadius: '8px 8px 0 0', margin: 0 }}
        >
          💳 Fine ledger
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'checkout' && (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '1rem auto', width: '100%' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Create Book Checkout Loan</h3>

          {checkoutError && (
            <div
              style={{
                background: 'var(--danger-glow)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--danger)',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              ⚠️ {checkoutError}
            </div>
          )}

          {checkoutSuccess && (
            <div
              style={{
                background: 'var(--success-glow)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: 'var(--success)',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              ✅ Book checkout registered successfully! Copies updated.
            </div>
          )}

          <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
              <label className="form-label">Select Book to Issue *</label>
              <select
                className="form-input form-select"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value ? Number(e.target.value) : '')}
                required
              >
                <option value="">-- Choose Book from Inventory --</option>
                {activeBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} (ISBN: {b.isbn}) - {b.availableCopies} available
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
              <label className="form-label">Select Active Library Member *</label>
              <select
                className="form-input form-select"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value ? Number(e.target.value) : '')}
                required
              >
                <option value="">-- Choose Registered Cardholder --</option>
                {activeMembers.map((m) => {
                  const user = users.find((u) => u.id === m.userId);
                  return (
                    <option key={m.id} value={m.id}>
                      {user?.fullName} ({m.cardNumber}) - {m.booksCheckedOut}/5 checked out
                    </option>
                  );
                })}
              </select>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--panel-border)',
                borderRadius: '8px',
                padding: '1rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
              }}
            >
              ℹ️ **Checkout Policy Note:**
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Default loan period is **14 days**.</li>
                <li>Overdue returns are penalized at a rate of **$1.00 per day**.</li>
                <li>Members are limited to a maximum of **5 active loans** at any time.</li>
              </ul>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '45px', marginTop: '1rem' }}>
              Confirm Checkout Loan
            </button>
          </form>
        </div>
      )}

      {activeTab === 'returns' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Active Loans Return Desk</h3>
            <input
              type="text"
              className="form-input"
              style={{ maxWidth: '300px' }}
              placeholder="Search active loans..."
              value={txSearch}
              onChange={(e) => setTxSearch(e.target.value)}
            />
          </div>

          <div className="table-container">
            {filteredActiveTransactions.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                📥 No active checkouts found.
              </div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Book Details</th>
                    <th>Library Member</th>
                    <th>Checkout Date</th>
                    <th>Due Date</th>
                    <th>Accrued Fine</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActiveTransactions.map((t) => {
                    const accrued = StorageService.calculateAccruedFine(t);
                    const isOverdue = new Date() > new Date(t.dueDate);
                    return (
                      <tr key={t.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.book?.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ISBN: {t.book?.isbn}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{t.memberUser?.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Card ID: {t.member?.cardNumber}</div>
                        </td>
                        <td>{t.issueDate}</td>
                        <td style={{ color: isOverdue ? 'var(--danger)' : 'inherit', fontWeight: isOverdue ? 600 : 400 }}>
                          {t.dueDate}
                          {isOverdue && <span style={{ fontSize: '0.75rem', marginLeft: '0.25rem' }}>(Overdue)</span>}
                        </td>
                        <td style={{ color: accrued > 0 ? 'var(--danger)' : 'inherit', fontWeight: accrued > 0 ? 600 : 400 }}>
                          ${accrued.toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleReturn(t.id)}
                            className="btn btn-primary"
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
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
      )}

      {activeTab === 'fines' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Fine Penalties Ledger</h3>
            <input
              type="text"
              className="form-input"
              style={{ maxWidth: '300px' }}
              placeholder="Search by cardholder..."
              value={fineSearch}
              onChange={(e) => setFineSearch(e.target.value)}
            />
          </div>

          <div className="table-container">
            {filteredFines.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                💳 No fines recorded in ledger.
              </div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Cardholder</th>
                    <th>Book Return Details</th>
                    <th>Overdue Fine</th>
                    <th>Payment Status</th>
                    <th>Date Cleared</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFines.map((f) => {
                    const isPaid = f.paymentStatus === 'Paid';
                    return (
                      <tr key={f.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.memberUser?.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Card ID: {f.member?.cardNumber}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{f.book?.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {f.tx?.dueDate}</div>
                        </td>
                        <td style={{ color: isPaid ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                          ${f.fineAmount.toFixed(2)}
                        </td>
                        <td>
                          <span className={`badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}`}>
                            {f.paymentStatus}
                          </span>
                        </td>
                        <td>{f.paidDate || '—'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleOpenPaymentModal(f.id, f.fineAmount, f.memberUser?.fullName || 'Member', f.book?.title || 'Book')}
                            className="btn btn-secondary pay-fine-btn"
                            style={{
                              fontSize: '0.8rem',
                              padding: '0.4rem 0.8rem',
                              visibility: isPaid ? 'hidden' : 'visible',
                              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                              color: '#ffffff',
                              border: 'none',
                              fontWeight: 600
                            }}
                          >
                            💳 Pay Fine (Razorpay)
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
      )}

      {/* Razorpay Fine Payment Modal */}
      {paymentModalOpen && pendingFineItem && (
        <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-content razorpay-modal" style={{ maxWidth: '440px', padding: 0, overflow: 'hidden', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ background: '#0f172a', padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>💳</span>
                <div>
                  <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem', fontWeight: 700 }}>Razorpay Secure Checkout</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>AthenaLMS Fine Settlement Portal</span>
                </div>
              </div>
              <span className="badge" style={{ background: '#0284c7', color: '#fff', fontSize: '0.7rem' }}>TEST MODE</span>
            </div>

            <div style={{ padding: '1.5rem', background: '#1e293b' }}>
              {paymentReceipt ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                  <h3 style={{ color: '#34d399', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Payment Successful!</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Transaction Order Ref: {paymentReceipt.transactionId}</p>
                  <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', color: '#e2e8f0', textAlign: 'left' }}>
                    <div><strong>Amount Paid:</strong> ${paymentReceipt.amount.toFixed(2)}</div>
                    <div><strong>Date Cleared:</strong> {paymentReceipt.date}</div>
                    <div><strong>Status:</strong> Settled & Privilege Restored</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmRazorpayPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Fine Settlement Item</div>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem', marginTop: '0.25rem' }}>{pendingFineItem.bookTitle}</div>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Cardholder: {pendingFineItem.memberName}</div>
                    <div style={{ borderTop: '1px solid #1e293b', marginTop: '0.75rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Payable Amount</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>${pendingFineItem.amount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Select Payment Method</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                      <button type="button" onClick={() => setPaymentMethod('upi')} className={`btn ${paymentMethod === 'upi' ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '0.75rem', padding: '0.4rem' }}>
                        📱 UPI / GPay
                      </button>
                      <button type="button" onClick={() => setPaymentMethod('card')} className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '0.75rem', padding: '0.4rem' }}>
                        💳 Card
                      </button>
                      <button type="button" onClick={() => setPaymentMethod('netbanking')} className={`btn ${paymentMethod === 'netbanking' ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '0.75rem', padding: '0.4rem' }}>
                        🏦 NetBanking
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Enter VPA / UPI ID</label>
                      <input type="text" className="form-input" defaultValue="student@okaxis" style={{ background: '#0f172a', borderColor: '#334155', color: '#fff' }} required />
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input type="text" className="form-input" placeholder="4111 •••• •••• 1111" defaultValue="4532 8921 4410 9012" style={{ background: '#0f172a', borderColor: '#334155', color: '#fff' }} required />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input type="text" className="form-input" placeholder="MM/YY" defaultValue="08/28" style={{ background: '#0f172a', borderColor: '#334155', color: '#fff' }} required />
                        <input type="password" className="form-input" placeholder="CVV" defaultValue="123" style={{ background: '#0f172a', borderColor: '#334155', color: '#fff' }} required />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => setPaymentModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }} disabled={paymentProcessing}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary confirm-razorpay-btn" style={{ flex: 1, background: 'linear-gradient(135deg, #0284c7, #2563eb)' }} disabled={paymentProcessing}>
                      {paymentProcessing ? 'Processing...' : `Pay $${pendingFineItem.amount.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
