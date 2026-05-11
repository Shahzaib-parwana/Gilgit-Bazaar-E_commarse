import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/password-reset/', { email });
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.email?.[0] || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  // Success state after email sent
  if (emailSent) {
    return (
      <div className="forgot-password-wrap">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

          .forgot-password-wrap {
            background: var(--midnight);
            min-height: calc(100vh - 200px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 100px 20px 80px;
            font-family: 'DM Sans', sans-serif;
          }

          :root {
            --midnight: #0a0f1e;
            --navy: #0d1635;
            --navy-2: #131c42;
            --gold: #f0a500;
            --gold-light: #fbbf24;
            --gold-dim: rgba(240,165,0,0.12);
            --muted: #8892aa;
            --white: #ffffff;
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .success-card {
            max-width: 480px;
            width: 100%;
            background: var(--navy-2);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 28px;
            padding: 40px 36px;
            text-align: center;
            animation: fadeUp 0.6s ease forwards;
          }

          .success-icon {
            width: 72px;
            height: 72px;
            background: var(--gold-dim);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }
          .success-icon svg {
            color: var(--gold);
            width: 36px;
            height: 36px;
          }
          .success-card h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            font-weight: 800;
            color: #fff;
            margin-bottom: 12px;
          }
          .success-card p {
            color: var(--muted);
            font-size: 0.9rem;
            margin-bottom: 8px;
          }
          .success-card .email-highlight {
            color: var(--gold);
            font-weight: 600;
            margin-bottom: 24px;
          }
          .success-message {
            background: rgba(255,255,255,0.04);
            border-radius: 16px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
          }
          .success-message p {
            color: rgba(255,255,255,0.7);
            font-size: 0.85rem;
            margin-bottom: 12px;
            line-height: 1.5;
          }
          .btn-secondary {
            width: 100%;
            background: transparent;
            border: 1px solid rgba(240,165,0,0.4);
            color: var(--gold);
            padding: 12px;
            border-radius: 40px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.25s;
            margin-bottom: 12px;
          }
          .btn-secondary:hover {
            background: var(--gold-dim);
            border-color: var(--gold);
          }
          .btn-outline-link {
            display: block;
            width: 100%;
            background: transparent;
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
            padding: 12px;
            border-radius: 40px;
            text-decoration: none;
            text-align: center;
            font-weight: 600;
            transition: all 0.25s;
          }
          .btn-outline-link:hover {
            border-color: var(--gold);
            color: var(--gold);
          }
        `}</style>
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle />
          </div>
          <h2>Check Your Email</h2>
          <p>We've sent password reset instructions to</p>
          <div className="email-highlight">{email}</div>
          <div className="success-message">
            <p>✓ Click the link in the email to reset your password.</p>
            <p>✓ If you don't see it, check your spam folder.</p>
            <p>✓ The reset link will expire in 24 hours.</p>
          </div>
          <button onClick={() => setEmailSent(false)} className="btn-secondary">
            Try Another Email
          </button>
          <Link to="/login" className="btn-outline-link">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // Initial form state
  return (
    <div className="forgot-password-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .forgot-password-wrap {
          background: var(--midnight);
          min-height: calc(100vh - 200px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px 80px;
          font-family: 'DM Sans', sans-serif;
        }

        :root {
          --midnight: #0a0f1e;
          --navy: #0d1635;
          --navy-2: #131c42;
          --gold: #f0a500;
          --gold-light: #fbbf24;
          --gold-dim: rgba(240,165,0,0.12);
          --muted: #8892aa;
          --white: #ffffff;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .forgot-card {
          max-width: 480px;
          width: 100%;
          background: var(--navy-2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 40px 36px;
          animation: fadeUp 0.6s ease forwards;
        }

        .forgot-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .forgot-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }
        .forgot-header p {
          color: var(--muted);
          font-size: 0.9rem;
        }

        .input-group {
          margin-bottom: 24px;
        }
        .input-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 8px;
          color: #fff;
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gold);
          width: 18px;
          height: 18px;
          pointer-events: none;
        }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 14px 16px 14px 44px;
          color: #fff;
          font-size: 0.95rem;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--gold);
          background: rgba(240,165,0,0.08);
          box-shadow: 0 0 0 3px rgba(240,165,0,0.2);
        }

        .btn-submit {
          width: 100%;
          background: var(--gold);
          color: #000;
          border: none;
          border-radius: 40px;
          padding: 14px 20px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-submit:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(240,165,0,0.3);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          transform: none;
          cursor: not-allowed;
        }

        .back-link {
          text-align: center;
          margin-top: 24px;
        }
        .back-link a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--gold);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .back-link a:hover {
          color: var(--gold-light);
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .forgot-card { padding: 28px 20px; }
          .forgot-header h2 { font-size: 1.6rem; }
        }
      `}</style>

      <div className="forgot-card">
        <div className="forgot-header">
          <h2>Forgot Password?</h2>
          <p>Enter your email to reset your password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="back-link">
          <Link to="/login">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;