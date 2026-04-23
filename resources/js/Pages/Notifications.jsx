import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Components/Layout';
import { useNotifications } from '../Components/NotificationProvider';
import { NotificationItem } from '../Components/Notification';
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info, MessageSquare } from 'lucide-react';

export default function Notifications() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading } = useNotifications();

    const getStats = () => {
        const total = notifications.length;
        const unread = notifications.filter(n => !n.read_at).length;
        const read = total - unread;

        const types = notifications.reduce((acc, notification) => {
            acc[notification.type] = (acc[notification.type] || 0) + 1;
            return acc;
        }, {});

        return { total, unread, read, types };
    };

    const stats = getStats();

    return (
        <Layout>
            <Head title="Notifications" />

            <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#6B7280',
                            textDecoration: 'none',
                            fontSize: '14px',
                            marginBottom: '16px'
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{
                                fontSize: '32px',
                                fontWeight: 800,
                                color: '#111827',
                                margin: '0 0 8px 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <Bell size={32} style={{ color: '#8B5CF6' }} />
                                Notifications
                            </h1>
                            <p style={{ color: '#6B7280', margin: 0 }}>
                                Stay updated with your account activity and messages
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                disabled={loading}
                                style={{
                                    background: '#8B5CF6',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    padding: '12px 20px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#7C3AED'}
                                onMouseLeave={(e) => e.target.style.background = '#8B5CF6'}
                            >
                                <CheckCircle size={16} />
                                Mark All Read
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        background: '#FFFFFF',
                        border: '1px solid #F3F4F6',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#EFF6FF',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px'
                        }}>
                            <Bell size={24} style={{ color: '#3B82F6' }} />
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{stats.total}</div>
                        <div style={{ fontSize: '14px', color: '#6B7280' }}>Total Notifications</div>
                    </div>

                    <div style={{
                        background: '#FFFFFF',
                        border: '1px solid #F3F4F6',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#FEF3C7',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px'
                        }}>
                            <AlertCircle size={24} style={{ color: '#F59E0B' }} />
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{stats.unread}</div>
                        <div style={{ fontSize: '14px', color: '#6B7280' }}>Unread</div>
                    </div>

                    <div style={{
                        background: '#FFFFFF',
                        border: '1px solid #F3F4F6',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#ECFDF5',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px'
                        }}>
                            <CheckCircle size={24} style={{ color: '#10B981' }} />
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{stats.read}</div>
                        <div style={{ fontSize: '14px', color: '#6B7280' }}>Read</div>
                    </div>

                    <div style={{
                        background: '#FFFFFF',
                        border: '1px solid #F3F4F6',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#F3E8FF',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px'
                        }}>
                            <MessageSquare size={24} style={{ color: '#8B5CF6' }} />
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{stats.types.message || 0}</div>
                        <div style={{ fontSize: '14px', color: '#6B7280' }}>Messages</div>
                    </div>
                </div>

                {/* Notifications List */}
                <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #F3F4F6',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    {notifications.length === 0 ? (
                        <div style={{
                            padding: '80px 40px',
                            textAlign: 'center',
                            color: '#9CA3AF'
                        }}>
                            <Bell size={64} style={{ margin: '0 auto 24px', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#6B7280', margin: '0 0 8px 0' }}>
                                No notifications yet
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px' }}>
                                You'll receive notifications about your account activity and important updates here.
                            </p>
                        </div>
                    ) : (
                        <div>
                            {notifications.map(notification => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={markAsRead}
                                    onClose={deleteNotification}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}