import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CheckCircle, XCircle, Mail, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useContext(AuthContext);
  
  const [status, setStatus] = useState('verifying');
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setStatus('error');
    }
  }, [token]);

  const handleVerification = async () => {
    const result = await verifyEmail(token);
    if (result.success) {
      setStatus('success');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setStatus('error');
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setResending(true);
    const result = await resendVerification(email);
    setResending(false);
    
    if (result.success) {
      toast.success('Verification email resent!');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="verify-container">
        <div className="verify-card">
          <Loader size={48} className="spinner" style={{ color: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
          <h2>Verifying Your Email...</h2>
          <p>Please wait while we confirm your email address.</p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="verify-container">
        <div className="verify-card success">
          <CheckCircle size={64} style={{ color: '#4ade80' }} />
          <h2>Email Verified Successfully! 🎉</h2>
          <p>Your account has been verified. You will be redirected to the homepage shortly.</p>
          <Link to="/" className="btn-home">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-container">
      <div className="verify-card error">
        <XCircle size={64} style={{ color: '#f87171' }} />
        <h2>Verification Failed</h2>
        <p>The verification link is invalid or has expired.</p>
        
        <div className="resend-section">
          <p>Enter your email to receive a new verification link:</p>
          <div className="resend-input-group">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleResend} disabled={resending}>
              {resending ? 'Sending...' : 'Resend Link'}
            </button>
          </div>
        </div>
        
        <Link to="/login" className="back-link">← Back to Login</Link>
      </div>
      
      <style>{`
        .verify-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          padding: 20px;
        }
        .verify-card {
          background: var(--navy-2);
          border-radius: 28px;
          padding: 48px 40px;
          text-align: center;
          max-width: 500px;
          width: 100%;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .verify-card h2 {
          font-family: 'Playfair Display', serif;
          margin: 20px 0 10px;
          color: #fff;
        }
        .verify-card p {
          color: var(--muted);
          margin-bottom: 30px;
        }
        .btn-home {
          display: inline-block;
          background: var(--gold);
          color: #000;
          padding: 12px 30px;
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-home:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(240,165,0,0.3);
        }
        .resend-section {
          margin: 30px 0;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .resend-input-group {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          position: relative;
        }
        .resend-input-group .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gold);
        }
        .resend-input-group input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px 12px 42px;
          color: #fff;
          font-size: 0.9rem;
        }
        .resend-input-group input:focus {
          outline: none;
          border-color: var(--gold);
        }
        .resend-input-group button {
          background: var(--gold);
          border: none;
          border-radius: 12px;
          padding: 0 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .resend-input-group button:hover {
          background: var(--gold-light);
        }
        .back-link {
          color: var(--gold);
          text-decoration: none;
          font-size: 0.9rem;
        }
        .back-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;