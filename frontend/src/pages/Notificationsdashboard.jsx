import { useState, useEffect, useContext } from 'react';
import { Bell, Search, Filter, Check, Trash2, RefreshCw, ShoppingBag, Tag, Settings, Package } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import toast from 'react-hot-toast';
import NotificationDetailModal from '../components/notifacations/NotificationDetailModal';

// CSS Styles
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --nd-midnight: #0a0f1e;
  --nd-navy: #0d1635;
  --nd-navy-2: #131c42;
  --nd-slate: #1e2a4a;
  --nd-gold: #f0a500;
  --nd-gold-lt: #fbbf24;
  --nd-gold-dim: rgba(240,165,0,0.12);
  --nd-gold-bdr: rgba(240,165,0,0.28);
  --nd-muted: #8892aa;
  --nd-border: rgba(255,255,255,0.07);
  --nd-white: #ffffff;
  --nd-green: #4ade80;
  --nd-red: #ef4444;
  --nd-blue: #3b82f6;
  --nd-purple: #8b5cf6;
  --nd-spring: cubic-bezier(0.34,1.56,0.64,1);
  --nd-ease: cubic-bezier(0.25,0.46,0.45,0.94);
}

.xnd {
  min-height: 100vh;
  background: var(--nd-midnight);
  font-family: 'DM Sans', sans-serif;
  padding: 100px 0 60px;
}

.xnd-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
}

.xnd-header {
  margin-bottom: 40px;
}

.xnd-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.xnd-title-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}

.xnd-title-icon {
  width: 56px;
  height: 56px;
  background: var(--nd-gold-dim);
  border: 1px solid var(--nd-gold-bdr);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--nd-gold);
}

.xnd-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--nd-white);
  margin: 0;
}

.xnd-title span {
  color: var(--nd-gold);
}

.xnd-actions {
  display: flex;
  gap: 12px;
}

.xnd-btn-refresh {
  background: var(--nd-navy-2);
  border: 1px solid var(--nd-border);
  border-radius: 12px;
  padding: 12px 20px;
  color: var(--nd-muted);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.xnd-btn-refresh:hover {
  border-color: var(--nd-gold-bdr);
  color: var(--nd-gold);
  background: var(--nd-gold-dim);
}

.xnd-btn-create {
  background: var(--nd-gold);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s var(--nd-spring);
}
.xnd-btn-create:hover {
  background: var(--nd-gold-lt);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(240,165,0,0.35);
}

.xnd-filters {
  background: var(--nd-navy-2);
  border: 1px solid var(--nd-border);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 32px;
}

.xnd-filters-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 16px;
  align-items: center;
}

@media (max-width: 1024px) {
  .xnd-filters-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .xnd-filters-row {
    grid-template-columns: 1fr;
  }
}

.xnd-search {
  position: relative;
}

.xnd-search svg {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--nd-muted);
  pointer-events: none;
}

.xnd-search input {
  width: 100%;
  background: var(--nd-navy);
  border: 1.5px solid var(--nd-border);
  border-radius: 12px;
  padding: 12px 16px 12px 48px;
  color: var(--nd-white);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}
.xnd-search input:focus {
  outline: none;
  border-color: var(--nd-gold-bdr);
  box-shadow: 0 0 0 3px rgba(240,165,0,0.08);
}
.xnd-search input::placeholder {
  color: var(--nd-muted);
  opacity: 0.6;
}

.xnd-select {
  background: var(--nd-navy);
  border: 1.5px solid var(--nd-border);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--nd-white);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.xnd-select:focus {
  outline: none;
  border-color: var(--nd-gold-bdr);
  box-shadow: 0 0 0 3px rgba(240,165,0,0.08);
}

.xnd-btn-filter {
  background: transparent;
  border: 1.5px solid var(--nd-border);
  border-radius: 12px;
  padding: 12px 20px;
  color: var(--nd-muted);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.xnd-btn-filter:hover {
  border-color: var(--nd-gold-bdr);
  color: var(--nd-gold);
  background: var(--nd-gold-dim);
}

.xnd-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .xnd-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .xnd-stats {
    grid-template-columns: 1fr;
  }
}

.xnd-stat-card {
  background: var(--nd-navy-2);
  border: 1px solid var(--nd-border);
  border-radius: 18px;
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
}
.xnd-stat-card:hover {
  border-color: var(--nd-gold-bdr);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.3);
}
.xnd-stat-card.active {
  border-color: var(--nd-gold);
  background: var(--nd-gold-dim);
}

.xnd-stat-label {
  font-size: 0.85rem;
  color: var(--nd-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.xnd-stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--nd-white);
}

.xnd-stat-value.gold { color: var(--nd-gold); }
.xnd-stat-value.green { color: var(--nd-green); }
.xnd-stat-value.blue { color: var(--nd-blue); }

.xnd-list {
  background: var(--nd-navy-2);
  border: 1px solid var(--nd-border);
  border-radius: 20px;
  overflow: hidden;
}

.xnd-list-header {
  background: rgba(255,255,255,0.02);
  padding: 20px 24px;
  border-bottom: 1px solid var(--nd-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.xnd-list-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--nd-white);
}

.xnd-bulk-actions {
  display: flex;
  gap: 12px;
}

.xnd-bulk-btn {
  background: transparent;
  border: 1px solid var(--nd-border);
  border-radius: 8px;
  padding: 6px 12px;
  color: var(--nd-muted);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.xnd-bulk-btn:hover {
  border-color: var(--nd-gold);
  color: var(--nd-gold);
  background: var(--nd-gold-dim);
}

.xnd-items {
  max-height: 600px;
  overflow-y: auto;
}

.xnd-items::-webkit-scrollbar { width: 6px; }
.xnd-items::-webkit-scrollbar-track { background: var(--nd-navy); }
.xnd-items::-webkit-scrollbar-thumb { background: var(--nd-slate); border-radius: 10px; }
.xnd-items::-webkit-scrollbar-thumb:hover { background: var(--nd-gold-bdr); }

.xnd-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.25s ease;
  cursor: pointer;
}
.xnd-item:hover {
  background: rgba(255,255,255,0.02);
}
.xnd-item:last-child {
  border-bottom: none;
}
.xnd-item.unread {
  background: var(--nd-gold-dim);
}

.xnd-item-icon {
  width: 48px;
  height: 48px;
  background: var(--nd-navy);
  border: 1px solid var(--nd-border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--nd-muted);
  flex-shrink: 0;
}
.xnd-item-icon.unread {
  background: var(--nd-gold-dim);
  border-color: var(--nd-gold-bdr);
  color: var(--nd-gold);
}

.xnd-item-content {
  flex: 1;
  min-width: 0;
}

.xnd-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.xnd-item-title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--nd-white);
  margin: 0;
}

.xnd-item-message {
  font-size: 0.85rem;
  color: var(--nd-muted);
  line-height: 1.5;
  margin-bottom: 8px;
}

.xnd-item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.xnd-badge {
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.xnd-badge-order { background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: var(--nd-blue); }
.xnd-badge-promo { background: rgba(240,165,0,0.15); border: 1px solid rgba(240,165,0,0.3); color: var(--nd-gold); }
.xnd-badge-system { background: rgba(136,146,170,0.15); border: 1px solid rgba(136,146,170,0.3); color: var(--nd-muted); }
.xnd-badge-product { background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3); color: var(--nd-purple); }
.xnd-badge-account { background: rgba(74,222,128,0.15); border: 1px solid rgba(74,222,128,0.3); color: var(--nd-green); }

.xnd-item-date {
  font-size: 0.75rem;
  color: var(--nd-muted);
  white-space: nowrap;
}

.xnd-item-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.xnd-btn-icon {
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid var(--nd-border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--nd-muted);
  cursor: pointer;
  transition: all 0.25s ease;
}
.xnd-btn-icon:hover {
  background: var(--nd-gold);
  border-color: var(--nd-gold);
  color: #000;
  transform: scale(1.08);
}
.xnd-btn-icon.delete:hover {
  background: var(--nd-red);
  border-color: var(--nd-red);
  color: var(--nd-white);
}

.xnd-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
}

.xnd-empty-icon {
  width: 100px;
  height: 100px;
  background: var(--nd-navy);
  border: 1px solid var(--nd-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.xnd-empty-icon svg {
  color: var(--nd-muted);
  width: 44px;
  height: 44px;
}

.xnd-empty h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--nd-white);
  margin: 0 0 8px 0;
}

.xnd-empty p {
  color: var(--nd-muted);
  font-size: 0.9rem;
  margin: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.xnd-spinner {
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
  color: var(--nd-gold);
}
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const styleId = 'notifications-dashboard-styles';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }
}

// Main NotificationsDashboard Component
const NotificationsDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    today: 0
  });

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    return !!(token && userData);
  };

  useEffect(() => {
    if (!authLoading && isUserLoggedIn()) {
      fetchNotifications();
    }
  }, [filter, typeFilter, authLoading]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter === 'unread') {
        params.is_read = 'false';
      } else if (filter === 'read') {
        params.is_read = 'true';
      }
      
      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }
      
      const data = await notificationService.getNotifications(params);
      
      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.results)) {
        items = data.results;
      } else if (data && Array.isArray(data.items)) {
        items = data.items;
      }
      
      setNotifications(items);
      
      const unread = items.filter(n => n && !n.is_read).length;
      const today = items.filter(n => {
        if (!n || !n.created_at) return false;
        const created = new Date(n.created_at);
        const now = new Date();
        return created.toDateString() === now.toDateString();
      }).length;
      
      setStats({
        total: items.length,
        unread,
        read: items.length - unread,
        today
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      } else {
        toast.error('Failed to load notifications');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      toast.success('Marked as read');
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    
    try {
      await notificationService.deleteNotification(id);
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
    fetchNotifications();
  };

  const handleMarkAsReadFromModal = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setStats(prev => ({
        ...prev,
        unread: prev.unread - 1,
        read: prev.read + 1
      }));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'order': return <ShoppingBag size={20} />;
      case 'promo': return <Tag size={20} />;
      case 'product': return <Package size={20} />;
      case 'account': return <Settings size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getTypeBadgeClass = (type) => {
    const map = {
      order: 'xnd-badge-order',
      promo: 'xnd-badge-promo',
      system: 'xnd-badge-system',
      product: 'xnd-badge-product',
      account: 'xnd-badge-account'
    };
    return map[type] || 'xnd-badge-system';
  };

  const getTypeDisplay = (type) => {
    const map = {
      order: 'Order',
      promo: 'Promotion',
      system: 'System',
      product: 'Product',
      account: 'Account'
    };
    return map[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (!n) return false;
    const matchesSearch = (n.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (n.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (authLoading) {
    return (
      <div className="xnd">
        <div className="xnd-container">
          <div className="xnd-empty">
            <RefreshCw size={32} className="xnd-spinner" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isUserLoggedIn()) {
    return (
      <div className="xnd">
        <div className="xnd-container">
          <div className="xnd-empty">
            <div className="xnd-empty-icon">
              <Bell size={44} />
            </div>
            <h3>Please Login</h3>
            <p>Login to view your notifications</p>
            <button 
              onClick={() => window.location.href = '/login'}
              style={{
                marginTop: '16px',
                padding: '10px 24px',
                background: '#f0a500',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="xnd">
      <div className="xnd-container">
        <div className="xnd-header">
          <div className="xnd-title-row">
            <div className="xnd-title-wrap">
              <div className="xnd-title-icon">
                <Bell size={28} />
              </div>
              <h1 className="xnd-title">Notifications <span>Dashboard</span></h1>
            </div>
            <div className="xnd-actions">
              <button className="xnd-btn-refresh" onClick={fetchNotifications}>
                <RefreshCw size={18} />
                Refresh
              </button>
              <button className="xnd-btn-create" onClick={handleMarkAllAsRead}>
                <Check size={18} />
                Mark All Read
              </button>
            </div>
          </div>

          <div className="xnd-filters">
            <div className="xnd-filters-row">
              <div className="xnd-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="xnd-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
              <select 
                className="xnd-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="order">Order Updates</option>
                <option value="promo">Promotions</option>
                <option value="product">Products</option>
                <option value="account">Account</option>
                <option value="system">System</option>
              </select>
              <button className="xnd-btn-filter" onClick={() => {
                setFilter('all');
                setTypeFilter('all');
                setSearchTerm('');
              }}>
                <Filter size={18} />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="xnd-stats">
          <div className={`xnd-stat-card ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            <div className="xnd-stat-label">Total</div>
            <div className="xnd-stat-value">{stats.total}</div>
          </div>
          <div className={`xnd-stat-card ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
            <div className="xnd-stat-label">Unread</div>
            <div className="xnd-stat-value gold">{stats.unread}</div>
          </div>
          <div className={`xnd-stat-card ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
            <div className="xnd-stat-label">Read</div>
            <div className="xnd-stat-value green">{stats.read}</div>
          </div>
          <div className="xnd-stat-card">
            <div className="xnd-stat-label">Today</div>
            <div className="xnd-stat-value blue">{stats.today}</div>
          </div>
        </div>

        <div className="xnd-list">
          <div className="xnd-list-header">
            <div className="xnd-list-title">
              {filter === 'all' ? 'All Notifications' : filter === 'unread' ? 'Unread Notifications' : 'Read Notifications'}
              {filteredNotifications.length > 0 && ` (${filteredNotifications.length})`}
            </div>
          </div>
          <div className="xnd-items">
            {loading ? (
              <div className="xnd-empty">
                <RefreshCw size={32} className="xnd-spinner" />
                <p>Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="xnd-empty">
                <div className="xnd-empty-icon">
                  <Bell size={44} />
                </div>
                <h3>No Notifications</h3>
                <p>You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`xnd-item ${!notification.is_read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`xnd-item-icon ${!notification.is_read ? 'unread' : ''}`}>
                    {getTypeIcon(notification.notification_type)}
                  </div>
                  <div className="xnd-item-content">
                    <div className="xnd-item-header">
                      <h3 className="xnd-item-title">{notification.title}</h3>
                      <span className="xnd-item-date">{formatDate(notification.created_at)}</span>
                    </div>
                    <p className="xnd-item-message">
                      {notification.message.length > 100 
                        ? `${notification.message.substring(0, 100)}...` 
                        : notification.message}
                    </p>
                    <div className="xnd-item-meta">
                      <span className={`xnd-badge ${getTypeBadgeClass(notification.notification_type)}`}>
                        {getTypeDisplay(notification.notification_type)}
                      </span>
                    </div>
                  </div>
                  <div className="xnd-item-actions" onClick={(e) => e.stopPropagation()}>
                    {!notification.is_read && (
                      <button 
                        className="xnd-btn-icon"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button 
                      className="xnd-btn-icon delete"
                      onClick={() => handleDelete(notification.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* External Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={handleCloseModal}
          onMarkAsRead={handleMarkAsReadFromModal}
        />
      )}
    </div>
  );
};

export default NotificationsDashboard;