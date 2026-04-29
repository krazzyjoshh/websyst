import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info, MessageSquare } from 'lucide-react';

const NotificationItem = ({ notification, onMarkAsRead, onClose }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} style={{ color: '#10B981' }} />;
            case 'error':
                return <AlertCircle size={20} style={{ color: '#EF4444' }} />;
            case 'warning':
                return <AlertCircle size={20} style={{ color: '#F59E0B' }} />;
            case 'info':
            default:
                return <Info size={20} style={{ color: '#3B82F6' }} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'success':
                return '#10B981';
            case 'error':
                return '#EF4444';
            case 'warning':
                return '#F59E0B';
            case 'info':
            default:
                return '#3B82F6';
        }
    };

    return (
        <div
            className={`notification-item ${!notification.read_at ? 'notification-item--unread' : ''}`}
            style={{
                borderLeft: `4px solid ${getTypeColor(notification.type)}`,
                background: notification.read_at ? '#F9FAFB' : '#FFFFFF',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            }}
            onClick={() => !notification.read_at && onMarkAsRead(notification.id)}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flexShrink: 0 }}>
                    {getIcon(notification.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#111827',
                        margin: '0 0 4px 0',
                        lineHeight: 1.4
                    }}>
                        {notification.title}
                    </h4>
                    <p style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        margin: '0 0 8px 0',
                        lineHeight: 1.4
                    }}>
                        {notification.message}
                    </p>
                    <p style={{
                        fontSize: '11px',
                        color: '#9CA3AF',
                        margin: 0
                    }}>
                        {new Date(notification.created_at).toLocaleString()}
                    </p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose(notification.id);
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        color: '#9CA3AF',
                        flexShrink: 0
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                    <X size={16} />
                </button>
            </div>
            {!notification.read_at && (
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '8px',
                    height: '8px',
                    background: '#3B82F6',
                    borderRadius: '50%'
                }} />
            )}
        </div>
    );
};

const NotificationDropdown = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClose, onViewAll, position = 'navbar' }) => {
    const unreadCount = notifications.filter(n => !n.read_at).length;

    const dropdownStyle = position === 'sidebar'
        ? {
            position: 'fixed',
            bottom: '80px',
            left: '260px',
            width: '400px',
            maxHeight: '500px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            zIndex: 9999,
            overflow: 'hidden'
        }
        : {
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            width: '400px',
            maxHeight: '500px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            zIndex: 9999,
            overflow: 'hidden'
        };

    return (
        <div
            className="notification-dropdown"
            onClick={(e) => e.stopPropagation()}
            style={dropdownStyle}
        >
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111827',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Bell size={18} />
                    Notifications
                    {unreadCount > 0 && (
                        <span style={{
                            background: '#EF4444',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '10px',
                            minWidth: '18px',
                            textAlign: 'center'
                        }}>
                            {unreadCount}
                        </span>
                    )}
                </h3>
                {unreadCount > 0 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onMarkAllAsRead();
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#3B82F6',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            position: 'relative',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#EFF6FF'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                        Mark all read
                    </button>
                )}
            </div>

            <div style={{
                maxHeight: '400px',
                overflowY: 'auto'
            }}>
                {notifications.length === 0 ? (
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: '#9CA3AF'
                    }}>
                        <Bell size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                        <p style={{ margin: 0, fontSize: '14px' }}>No notifications yet</p>
                    </div>
                ) : (
                    notifications.slice(0, 5).map(notification => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={onMarkAsRead}
                            onClose={onClose}
                        />
                    ))
                )}
            </div>

            {notifications.length > 5 && (
                <div style={{
                    padding: '12px 20px',
                    borderTop: '1px solid #F3F4F6',
                    textAlign: 'center'
                }}>
                    <button
                        onClick={onViewAll}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#3B82F6',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            width: '100%'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#EFF6FF'}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
};

const NotificationToast = ({ notification, onClose, autoClose = true }) => {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!autoClose) return;

        const duration = 5000; // 5 seconds
        const interval = 50;
        const steps = duration / interval;
        const decrement = 100 / steps;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev <= 0) {
                    setVisible(false);
                    return 0;
                }
                return prev - decrement;
            });
        }, interval);

        const closeTimer = setTimeout(() => {
            setVisible(false);
            onClose(notification.id);
        }, duration);

        return () => {
            clearInterval(timer);
            clearTimeout(closeTimer);
        };
    }, [autoClose, notification.id, onClose]);

    if (!visible) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} style={{ color: '#10B981' }} />;
            case 'error':
                return <AlertCircle size={20} style={{ color: '#EF4444' }} />;
            case 'warning':
                return <AlertCircle size={20} style={{ color: '#F59E0B' }} />;
            case 'message':
                return <MessageSquare size={20} style={{ color: '#8B5CF6' }} />;
            case 'info':
            default:
                return <Info size={20} style={{ color: '#3B82F6' }} />;
        }
    };

    const getBackgroundColor = (type) => {
        switch (type) {
            case 'success':
                return '#ECFDF5';
            case 'error':
                return '#FEF2F2';
            case 'warning':
                return '#FFFBEB';
            case 'message':
                return '#F3E8FF';
            case 'info':
            default:
                return '#EFF6FF';
        }
    };

    const getBorderColor = (type) => {
        switch (type) {
            case 'success':
                return '#10B981';
            case 'error':
                return '#EF4444';
            case 'warning':
                return '#F59E0B';
            case 'message':
                return '#8B5CF6';
            case 'info':
            default:
                return '#3B82F6';
        }
    };

    return (
        <div
            className="notification-toast"
            style={{
                position: 'relative',
                width: '350px',
                background: getBackgroundColor(notification.type),
                border: `1px solid ${getBorderColor(notification.type)}`,
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transform: visible ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease',
                overflow: 'hidden'
            }}
        >
            {autoClose && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '3px',
                        background: getBorderColor(notification.type),
                        width: `${progress}%`,
                        transition: 'width 0.05s linear'
                    }}
                />
            )}
            <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flexShrink: 0 }}>
                        {getIcon(notification.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#111827',
                            margin: '0 0 4px 0',
                            lineHeight: 1.4
                        }}>
                            {notification.title}
                        </h4>
                        <p style={{
                            fontSize: '13px',
                            color: '#6B7280',
                            margin: '0 0 8px 0',
                            lineHeight: 1.4
                        }}>
                            {notification.message}
                        </p>
                        <p style={{
                            fontSize: '11px',
                            color: '#9CA3AF',
                            margin: 0
                        }}>
                            {new Date(notification.created_at).toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setVisible(false);
                            setTimeout(() => onClose(notification.id), 300);
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            color: '#9CA3AF',
                            flexShrink: 0
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export { NotificationDropdown, NotificationToast, NotificationItem };