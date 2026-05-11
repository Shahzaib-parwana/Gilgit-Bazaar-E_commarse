import { useState, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      await login(formData);
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (error) {
      console.error('Login error:', error);
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
    <div className="login-form-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .login-form-wrap {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          z-index: 2;
        }

        .login-card {
          background: var(--navy-2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 40px 36px;
          box-shadow: 0 25px 45px -12px rgba(0,0,0,0.5);
          backdrop-filter: blur(2px);
          transition: all 0.3s ease;
          animation: fadeUp 0.6s ease forwards;
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

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }
        .login-header p {
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

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          font-size: 0.85rem;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
        }
        .checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: var(--gold);
        }
        .forgot-link {
          color: var(--gold);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .forgot-link:hover {
          color: var(--gold-light);
          text-decoration: underline;
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

        .divider {
          margin: 28px 0;
          position: relative;
          text-align: center;
        }
        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }
        .divider span {
          background: var(--navy-2);
          padding: 0 16px;
          font-size: 0.8rem;
          color: var(--muted);
          position: relative;
          z-index: 1;
        }

        .signup-link {
          text-align: center;
          margin-top: 8px;
        }
        .signup-link p {
          color: var(--muted);
          font-size: 0.9rem;
        }
        .signup-link a {
          color: var(--gold);
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .signup-link a:hover {
          color: var(--gold-light);
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .login-card { padding: 28px 20px; }
          .login-header h2 { font-size: 1.8rem; }
        }
      `}</style>

      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <div className="error-msg">{errors.email}</div>}
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
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
            {errors.password && <div className="error-msg">{errors.password}</div>}
          </div>

          {/* Remember & Forgot */}
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" name="remember-me" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="signup-link">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;