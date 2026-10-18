import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { type SystemSettings } from '../services/storage';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useLibrary();
  const [maxBooks, setMaxBooks] = useState(5);
  const [loanDuration, setLoanDuration] = useState(14);
  const [dailyFine, setDailyFine] = useState(1.0);
  const [suspensionLimit, setSuspensionLimit] = useState(10.0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setMaxBooks(settings.maxBooksAllowed);
      setLoanDuration(settings.loanDurationDays);
      setDailyFine(settings.dailyFineAmount);
      setSuspensionLimit(settings.suspensionFineLimit);
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SystemSettings = {
      maxBooksAllowed: maxBooks,
      loanDurationDays: loanDuration,
      dailyFineAmount: dailyFine,
      suspensionFineLimit: suspensionLimit,
    };
    updateSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '1.5rem auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--text-bright), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
          System Settings & Borrowing Policies
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Configure administrative controls and global borrowing constraints for the library system.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          {/* Max Books Checkouts */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Max Books Checked Out</span>
              <span className="badge badge-primary">{maxBooks} books</span>
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={maxBooks}
              onChange={(e) => setMaxBooks(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-color)', marginTop: '0.5rem' }}
            />
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
              Maximum number of active book checkouts a student member can have at any one time.
            </small>
          </div>

          {/* Loan Duration */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Loan Duration Period</span>
              <span className="badge badge-primary">{loanDuration} days</span>
            </label>
            <input
              type="range"
              min="3"
              max="60"
              step="1"
              value={loanDuration}
              onChange={(e) => setLoanDuration(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-color)', marginTop: '0.5rem' }}
            />
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
              Standard borrowing period allotted for issued books before they are flagged overdue.
            </small>
          </div>

          {/* Daily Fine Rate */}
          <div className="form-group">
            <label className="form-label">Daily Fine Rate (USD)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.25rem', color: 'var(--text-bright)' }}>$</span>
              <input
                type="number"
                min="0.10"
                max="10.00"
                step="0.10"
                value={dailyFine}
                onChange={(e) => setDailyFine(Number(e.target.value))}
                className="form-input"
                required
              />
            </div>
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
              Amount charged per day overdue for each late return.
            </small>
          </div>

          {/* Suspension Fine Limit */}
          <div className="form-group">
            <label className="form-label">Auto-Suspension Fine Limit (USD)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.25rem', color: 'var(--text-bright)' }}>$</span>
              <input
                type="number"
                min="1.00"
                max="100.00"
                step="1.00"
                value={suspensionLimit}
                onChange={(e) => setSuspensionLimit(Number(e.target.value))}
                className="form-input"
                required
              />
            </div>
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
              Accrued unpaid fine threshold at which a member card is automatically suspended.
            </small>
          </div>

        </div>

        {saveSuccess && (
          <div className="badge badge-success" style={{ padding: '0.75rem', width: '100%', textAlign: 'center', fontSize: '0.95rem' }}>
            ✓ System settings and borrowing policies updated successfully!
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            💾 Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
