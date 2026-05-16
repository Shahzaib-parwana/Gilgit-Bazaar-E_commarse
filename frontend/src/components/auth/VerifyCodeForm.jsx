import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyCodeForm = ({ email, onVerify, onResend }) => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }
    
    setLoading(true);
    try {
      await onVerify(email, code);
      navigate('/');
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    try {
      await onResend(email);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Resend error:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-form-wrap">
      <style>{`
        .verify-form-wrap {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          z-index: 2;
        }

        .verify-card {
          background: var(--navy-2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 40px 36px;
          box-shadow: 0 25px 45px -12px rgba(0,0,0,0.5);
          backdrop-filter: blur(2px);
          animation: fadeUp 0.6s ease forwards;
          text-align: center;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .verify-header {
          margin-bottom: 32px;
        }

        .verify-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .verify-header p {
          color: var(--muted);
          font-size: 0.9rem;
        }

        .email-badge {
          background: rgba(240,165,0,0.1);
          border: 1px solid rgba(240,165,0,0.3);
          border-radius: 12px;
          padding: 12px;
          margin: 20px 0;
          display: inline-block;
          color: var(--gold);
          font-weight: 500;
        }

        .code-inputs {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin: 30px 0;
        }

        .code-input {
          width: 55px;
          height: 65px;
          text-align: center;
          font-size: 24px;
          font-weight: 600;
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          font-family: monospace;
          transition: all 0.2s;
        }

        .code-input:focus {
          outline: none;
          border-color: var(--gold);
          background: rgba(240,165,0,0.08);
          box-shadow: 0 0 0 3px rgba(240,165,0,0.2);
        }

        .btn-verify {
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
          margin-top: 20px;
        }

        .btn-verify:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(240,165,0,0.3);
        }

        .btn-verify:disabled {
          opacity: 0.6;
          transform: none;
          cursor: not-allowed;
        }

        .resend-link {
          margin-top: 24px;
          text-align: center;
        }

        .resend-link button {
          background: none;
          border: none;
          color: var(--gold);
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .resend-link button:hover:not(:disabled) {
          color: var(--gold-light);
          text-decoration: underline;
        }

        .resend-link button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .back-link {
          margin-top: 20px;
          text-align: center;
        }

        .back-link a {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s;
        }

        .back-link a:hover {
          color: var(--gold);
        }

        @media (max-width: 640px) {
          .verify-card { padding: 28px 20px; }
          .code-input { width: 45px; height: 55px; font-size: 20px; }
          .code-inputs { gap: 8px; }
        }
      `}</style>

      <div className="verify-card">
        <div className="verify-header">
          <Mail size={48} style={{ color: 'var(--gold)', marginBottom: '15px' }} />
          <h2>Verify Your Email</h2>
          <p>We've sent a verification code to</p>
          <div className="email-badge">{email}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="code-inputs">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="code-input"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button type="submit" disabled={loading} className="btn-verify">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Verify Email
              </>
            )}
          </button>
        </form>

        <div className="resend-link">
          <button onClick={handleResend} disabled={resending || countdown > 0}>
            <RefreshCw size={16} className={resending ? 'animate-spin' : ''} />
            {countdown > 0 
              ? `Resend code in ${countdown}s` 
              : resending ? 'Sending...' : 'Resend verification code'}
          </button>
        </div>

        <div className="back-link">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodeForm;