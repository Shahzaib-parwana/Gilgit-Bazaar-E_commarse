import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    new_password: '',
    new_password_confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.new_password) {
      newErrors.new_password = 'Password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }

    if (formData.new_password !== formData.new_password_confirm) {
      newErrors.new_password_confirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/password-reset-confirm/', {
        uid,
        token,
        new_password: formData.new_password,
        new_password_confirm: formData.new_password_confirm,
      });

      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.non_field_errors) {
          toast.error(errorData.non_field_errors[0]);
        } else {
          toast.error('Invalid or expired reset link');
        }
      } else {
        toast.error('Failed to reset password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="reset-password-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .reset-password-wrap {
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

        .reset-card {
          max-width: 480px;
          width: 100%;
          background: var(--navy-2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 40px 36px;
          box-shadow: 0 25px 45px -12px rgba(0,0,0,0.5);
          animation: fadeUp 0.6s ease forwards;
        }

        .reset-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .reset-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }
        .reset-header p {
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
        .form-input.error {
          border-color: #f87171;
        }
        .toggle-password {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--muted);
          transition: color 0.2s;
        }
        .toggle-password:hover {
          color: var(--gold);
        }
        .error-msg {
          margin-top: 6px;
          font-size: 0.7rem;
          color: #f87171;
        }

        .requirements {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 16px;
          margin: 24px 0;
        }
        .requirements p {
          font-size: 0.8rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }
        .requirements ul {
          margin: 0;
          padding-left: 20px;
        }
        .requirements li {
          font-size: 0.75rem;
          color: var(--muted);
          margin-bottom: 4px;
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
          .reset-card { padding: 28px 20px; }
          .reset-header h2 { font-size: 1.6rem; }
        }
      `}</style>

      <div className="reset-card">
        <div className="reset-header">
          <h2>Reset Your Password</h2>
          <p>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="input-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className={`form-input ${errors.new_password ? 'error' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.new_password && <div className="error-msg">{errors.new_password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>Confirm New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                name="new_password_confirm"
                value={formData.new_password_confirm}
                onChange={handleChange}
                className={`form-input ${errors.new_password_confirm ? 'error' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="toggle-password"
              >
                {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.new_password_confirm && <div className="error-msg">{errors.new_password_confirm}</div>}
          </div>

          {/* Password Requirements */}
          <div className="requirements">
            <p>Password must contain:</p>
            <ul>
              <li>• At least 8 characters</li>
              <li>• Mix of letters and numbers</li>
              <li>• At least one special character recommended</li>
            </ul>
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="back-link">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;