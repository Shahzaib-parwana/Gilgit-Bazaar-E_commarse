import { useEffect } from 'react';
import { X, Bell, ShoppingBag, Tag, Package, Settings, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const NotificationDetailModal = ({ notification, onClose, onMarkAsRead }) => {
    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const getTypeIcon = (type) => {
        switch(type) {
            case 'order': return <ShoppingBag size={24} />;
            case 'promo': return <Tag size={24} />;
            case 'product': return <Package size={24} />;
            case 'account': return <Settings size={24} />;
            default: return <Bell size={24} />;
        }
    };

    const getTypeColor = (type) => {
        switch(type) {
            case 'order': return '#3b82f6';
            case 'promo': return '#f0a500';
            case 'product': return '#8b5cf6';
            case 'account': return '#4ade80';
            default: return '#8892aa';
        }
    };

    const getTypeDisplay = (type) => {
        const map = {
            order: 'Order Update',
            promo: 'Promotion',
            system: 'System',
            product: 'Product',
            account: 'Account'
        };
        return map[type] || type;
    };

    // Custom format date function (no external dependency)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-PK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleMarkAsRead = () => {
        if (!notification.is_read) {
            onMarkAsRead(notification.id);
        }
    };

    const handleClose = () => {
        if (!notification.is_read) {
            onMarkAsRead(notification.id);
        }
        onClose();
    };

    const handleActionClick = () => {
        if (notification.link) {
            window.location.href = notification.link;
            onClose();
        }
    };

    return (
        <div className="notification-modal-overlay" onClick={handleClose}>
            <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
                <div className="notification-modal-header" style={{ borderBottomColor: getTypeColor(notification.notification_type) }}>
                    <div className="notification-modal-header-left">
                        <div className="notification-modal-icon" style={{ background: `${getTypeColor(notification.notification_type)}20`, color: getTypeColor(notification.notification_type) }}>
                            {getTypeIcon(notification.notification_type)}
                        </div>
                        <div>
                            <h2>{notification.title}</h2>
                            <span className={`notification-badge ${notification.notification_type}`}>
                                {getTypeDisplay(notification.notification_type)}
                            </span>
                        </div>
                    </div>
                    <button className="notification-modal-close" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="notification-modal-body">
                    <div className="notification-message">
                        {notification.message}
                    </div>
                    
                    <div className="notification-meta">
                        <div className="meta-item">
                            <Calendar size={16} />
                            <span>{formatDate(notification.created_at)}</span>
                        </div>
                        <div className="meta-item">
                            {notification.is_read ? (
                                <>
                                    <CheckCircle size={16} color="#4ade80" />
                                    <span style={{ color: '#4ade80' }}>Read</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle size={16} color="#f0a500" />
                                    <span style={{ color: '#f0a500' }}>Unread</span>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                        <div className="notification-metadata">
                            <h4>Additional Information</h4>
                            <div className="metadata-grid">
                                {Object.entries(notification.metadata).map(([key, value]) => (
                                    <div key={key} className="metadata-item">
                                        <span className="metadata-key">{key.replace(/_/g, ' ').toUpperCase()}:</span>
                                        <span className="metadata-value">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="notification-modal-footer">
                    {!notification.is_read && (
                        <button className="modal-btn-primary" onClick={handleMarkAsRead}>
                            <CheckCircle size={16} />
                            Mark as Read
                        </button>
                    )}
                    {notification.link && (
                        <button className="modal-btn-secondary" onClick={handleActionClick}>
                            View Details
                        </button>
                    )}
                    <button className="modal-btn-secondary" onClick={handleClose}>
                        Close
                    </button>
                </div>
            </div>
            
            <style>{`
                .notification-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.2s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .notification-modal {
                    background: #131c42;
                    border: 1px solid rgba(240,165,0,0.28);
                    border-radius: 24px;
                    max-width: 550px;
                    width: 90%;
                    max-height: 85vh;
                    overflow: hidden;
                    animation: slideUp 0.3s ease;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                }
                
                .notification-modal-header {
                    padding: 24px;
                    border-bottom: 2px solid;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #0d1635;
                }
                
                .notification-modal-header-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .notification-modal-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .notification-modal-header h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #fff;
                    margin: 0 0 6px 0;
                }
                
                .notification-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 8px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .notification-badge.order {
                    background: rgba(59,130,246,0.15);
                    border: 1px solid rgba(59,130,246,0.3);
                    color: #3b82f6;
                }
                
                .notification-badge.promo {
                    background: rgba(240,165,0,0.15);
                    border: 1px solid rgba(240,165,0,0.3);
                    color: #f0a500;
                }
                
                .notification-badge.system {
                    background: rgba(136,146,170,0.15);
                    border: 1px solid rgba(136,146,170,0.3);
                    color: #8892aa;
                }
                
                .notification-badge.product {
                    background: rgba(139,92,246,0.15);
                    border: 1px solid rgba(139,92,246,0.3);
                    color: #8b5cf6;
                }
                
                .notification-badge.account {
                    background: rgba(74,222,128,0.15);
                    border: 1px solid rgba(74,222,128,0.3);
                    color: #4ade80;
                }
                
                .notification-modal-close {
                    background: transparent;
                    border: none;
                    color: #8892aa;
                    cursor: pointer;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                
                .notification-modal-close:hover {
                    background: rgba(255,255,255,0.1);
                    color: #fff;
                }
                
                .notification-modal-body {
                    padding: 24px;
                    max-height: 50vh;
                    overflow-y: auto;
                }
                
                .notification-modal-body::-webkit-scrollbar {
                    width: 6px;
                }
                
                .notification-modal-body::-webkit-scrollbar-track {
                    background: #0d1635;
                }
                
                .notification-modal-body::-webkit-scrollbar-thumb {
                    background: #1e2a4a;
                    border-radius: 10px;
                }
                
                .notification-message {
                    color: rgba(255,255,255,0.9);
                    line-height: 1.6;
                    font-size: 1rem;
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                
                .notification-meta {
                    display: flex;
                    gap: 20px;
                    margin-top: 20px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(255,255,255,0.07);
                }
                
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #8892aa;
                    font-size: 0.85rem;
                }
                
                .notification-metadata {
                    margin-top: 20px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(255,255,255,0.07);
                }
                
                .notification-metadata h4 {
                    color: #fff;
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin: 0 0 12px 0;
                }
                
                .metadata-grid {
                    background: #0d1635;
                    border-radius: 16px;
                    padding: 16px;
                }
                
                .metadata-item {
                    display: flex;
                    gap: 12px;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                
                .metadata-item:last-child {
                    border-bottom: none;
                }
                
                .metadata-key {
                    font-weight: 600;
                    color: #f0a500;
                    font-size: 0.8rem;
                    min-width: 100px;
                }
                
                .metadata-value {
                    color: rgba(255,255,255,0.8);
                    font-size: 0.85rem;
                    word-break: break-word;
                }
                
                .notification-modal-footer {
                    padding: 20px 24px;
                    border-top: 1px solid rgba(255,255,255,0.07);
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    background: #0d1635;
                }
                
                .modal-btn-primary {
                    background: #f0a500;
                    color: #000;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .modal-btn-primary:hover {
                    background: #fbbf24;
                    transform: translateY(-1px);
                }
                
                .modal-btn-secondary {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #8892aa;
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .modal-btn-secondary:hover {
                    border-color: #f0a500;
                    color: #f0a500;
                }
            `}</style>
        </div>
    );
};

export default NotificationDetailModal;