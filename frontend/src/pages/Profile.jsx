import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { User, Lock, Mail, Phone, MapPin, Building, CreditCard, Save, KeyRound } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip_code: user?.zip_code || '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(profileData);
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      toast.success('Password changed successfully');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      toast.error(error.response?.data?.old_password?.[0] || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .profile-page-wrap {
          background: var(--midnight);
          min-height: 100vh;
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
          --slate: #1e2a4a;
          --muted: #8892aa;
          --white: #ffffff;
        }

        .profile-container {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Header */
        .profile-header {
          margin-bottom: 32px;
          animation: fadeUp 0.5s ease forwards;
        }
        .profile-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }
        .profile-header p {
          color: var(--muted);
          font-size: 0.9rem;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 8px;
          background: var(--navy-2);
          padding: 6px;
          border-radius: 60px;
          margin-bottom: 32px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .tab-btn {
          flex: 1;
          padding: 12px 20px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 0.9rem;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.25s;
          color: var(--muted);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .tab-btn svg {
          width: 18px;
          height: 18px;
        }
        .tab-btn.active {
          background: var(--gold);
          color: #000;
          box-shadow: 0 4px 12px rgba(240,165,0,0.3);
        }
        .tab-btn:not(.active):hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }

        /* Cards */
        .profile-card {
          background: var(--navy-2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 32px;
          animation: fadeUp 0.5s ease forwards;
          box-shadow: 0 20px 35px -12px rgba(0,0,0,0.4);
        }
        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .card-title svg {
          color: var(--gold);
        }

        /* Form Grid */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .full-width {
          grid-column: span 2;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
        }
        .input-icon-wrapper {
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
        textarea ~ .input-icon {
          top: 16px;
          transform: none;
        }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 12px 16px 12px 44px;
          color: #fff;
          font-size: 0.9rem;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--gold);
          background: rgba(240,165,0,0.08);
          box-shadow: 0 0 0 3px rgba(240,165,0,0.2);
        }
        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        textarea.form-input {
          resize: vertical;
          min-height: 80px;
        }
        .helper-text {
          font-size: 0.7rem;
          color: var(--muted);
          margin-top: 4px;
        }

        .btn-primary {
          background: var(--gold);
          color: #000;
          border: none;
          border-radius: 40px;
          padding: 12px 28px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.25s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
        }
        .btn-primary:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(240,165,0,0.3);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          transform: none;
          cursor: not-allowed;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .profile-page-wrap { padding: 80px 16px 60px; }
          .form-grid { grid-template-columns: 1fr; gap: 16px; }
          .full-width { grid-column: span 1; }
          .tabs { border-radius: 40px; }
          .tab-btn span { display: none; }
          .tab-btn svg { margin: 0; }
        }
      `}</style>

      <div className="profile-container">
        <div className="profile-header">
          <h1>My Account</h1>
          <p>Manage your profile, preferences and security</p>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> <span>Profile Information</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <Lock size={18} /> <span>Change Password</span>
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-card">
            <div className="card-title">
              <User size={24} /> Profile Information
            </div>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <div className="input-icon-wrapper">
                    <User className="input-icon" size={18} />
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, first_name: e.target.value })
                      }
                      className="form-input"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-icon-wrapper">
                    <User className="input-icon" size={18} />
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, last_name: e.target.value })
                      }
                      className="form-input"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Email Address</label>
                  <div className="input-icon-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="form-input"
                    />
                  </div>
                  <div className="helper-text">Email cannot be changed</div>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-icon-wrapper">
                    <Phone className="input-icon" size={18} />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      className="form-input"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <div className="input-icon-wrapper">
                    <MapPin className="input-icon" size={18} />
                    <textarea
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({ ...profileData, address: e.target.value })
                      }
                      className="form-input"
                      rows="3"
                      placeholder="House/Flat No., Street Name, Area"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>City</label>
                  <div className="input-icon-wrapper">
                    <Building className="input-icon" size={18} />
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) =>
                        setProfileData({ ...profileData, city: e.target.value })
                      }
                      className="form-input"
                      placeholder="Islamabad"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>State / Province</label>
                  <div className="input-icon-wrapper">
                    <MapPin className="input-icon" size={18} />
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) =>
                        setProfileData({ ...profileData, state: e.target.value })
                      }
                      className="form-input"
                      placeholder="Islamabad Capital Territory"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>ZIP / Postal Code</label>
                  <div className="input-icon-wrapper">
                    <CreditCard className="input-icon" size={18} />
                    <input
                      type="text"
                      value={profileData.zip_code}
                      onChange={(e) =>
                        setProfileData({ ...profileData, zip_code: e.target.value })
                      }
                      className="form-input"
                      placeholder="44000"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                <Save size={18} />
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="profile-card">
            <div className="card-title">
              <KeyRound size={24} /> Change Password
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Current Password</label>
                  <div className="input-icon-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      type="password"
                      value={passwordData.old_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, old_password: e.target.value })
                      }
                      required
                      className="form-input"
                      placeholder="Enter your current password"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-icon-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, new_password: e.target.value })
                      }
                      required
                      className="form-input"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="input-icon-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirm_password: e.target.value })
                      }
                      required
                      className="form-input"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                <KeyRound size={18} />
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;