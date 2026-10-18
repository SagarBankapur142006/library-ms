import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to authenticate');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError(null);
    setLoading(true);
    try {
      const res = await login(quickEmail, quickPass);
      if (!res.success) {
        setError(res.error || 'Failed to authenticate');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <div className="auth-logo">AthenaLMS</div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
            Library Information Management Gateway
          </h2>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--danger-glow)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--danger)',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              textAlign: 'left',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g., admin@library.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', height: '45px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ margin: '2rem 0 1rem 0', borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            ⚡ QUICK DEMO LOGINS (CLICK TO CHOOSE)
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => handleQuickLogin('admin@library.com', 'admin123')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              disabled={loading}
            >
              <span>🔑 Chief Administrator</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin</span>
            </button>

            <button
              onClick={() => handleQuickLogin('librarian@library.com', 'lib123')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              disabled={loading}
            >
              <span>📖 Sarah Jenkins</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Librarian</span>
            </button>

            <button
              onClick={() => handleQuickLogin('student1@library.com', 'student123')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              disabled={loading}
            >
              <span>🎓 John Doe</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
