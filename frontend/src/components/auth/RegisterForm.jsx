import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, Sparkles } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password2: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
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
      await register(formData);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
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
    <div className="register-form-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .register-form-wrap {
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          z-index: 2;
        }

        .register-card {
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

        .register-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .register-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }
        .register-header p {
          color: var(--muted);
          font-size: 0.9rem;
        }

        .input-group {
          margin-bottom: 20px;
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

        .row-2cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 20px 0 24px;
        }
        .terms-checkbox input {
          width: 18px;
          height: 18px;
          accent-color: var(--gold);
          margin-top: 2px;
        }
        .terms-checkbox label {
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .terms-checkbox a {
          color: var(--gold);
          text-decoration: none;
          font-weight: 500;
        }
        .terms-checkbox a:hover {
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

        .login-link {
          text-align: center;
          margin-top: 8px;
        }
        .login-link p {
          color: var(--muted);
          font-size: 0.9rem;
        }
        .login-link a {
          color: var(--gold);
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .login-link a:hover {
          color: var(--gold-light);
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .register-card { padding: 28px 20px; }
          .register-header h2 { font-size: 1.8rem; }
          .row-2cols { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>

      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join Gilgit Bazaar and start shopping</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First & Last Name Row */}
          <div className="row-2cols">
            <div className="input-group">
              <label>First Name *</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`form-input ${errors.first_name ? 'error' : ''}`}
                  placeholder="John"
                />
              </div>
              {errors.first_name && <div className="error-msg">{errors.first_name}</div>}
            </div>

            <div className="input-group">
              <label>Last Name *</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`form-input ${errors.last_name ? 'error' : ''}`}
                  placeholder="Doe"
                />
              </div>
              {errors.last_name && <div className="error-msg">{errors.last_name}</div>}
            </div>
          </div>

          {/* Username */}
          <div className="input-group">
            <label>Username *</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="johndoe"
              />
            </div>
            {errors.username && <div className="error-msg">{errors.username}</div>}
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email Address *</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <div className="error-msg">{errors.email}</div>}
          </div>

          {/* Phone (Optional) */}
          <div className="input-group">
            <label>Phone Number (Optional)</label>
            <div className="input-wrapper">
              <Phone className="input-icon" size={18} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+92 300 1234567"
              />
            </div>
          </div>

          {/* Password Row */}
          <div className="row-2cols">
            <div className="input-group">
              <label>Password *</label>
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

            <div className="input-group">
              <label>Confirm Password *</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword2 ? 'text' : 'password'}
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  className={`form-input ${errors.password2 ? 'error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="toggle-password"
                >
                  {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password2 && <div className="error-msg">{errors.password2}</div>}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the{' '}
              <Link to="/terms">Terms and Conditions</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="login-link">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;