import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../Components/Layout';
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info, MessageSquare, X, Trash2 } from 'lucide-react';

export default function Notifications({ notifications: paginatedNotifications, unreadCount: initialUnreadCount }) {
    const notificationsList = paginatedNotifications?.data || [];
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount || 0);

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

    const getTypeColor = (type) => {
        switch (type) {
            case 'success': return '#10B981';
            case 'error': return '#EF4444';
            case 'warning': return '#F59E0B';
            case 'message': return '#8B5CF6';
            case 'info': default: return '#3B82F6';
        }
    };

    const handleMarkAsRead = (notificationId) => {
        router.post(`/notifications/${notificationId}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => setUnreadCount(prev => Math.max(0, prev - 1)),
        });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, {
            preserveScroll: true,
            onSuccess: () => setUnreadCount(0),
        });
    };

    const handleDelete = (notificationId) => {
        router.delete(`/notifications/${notificationId}`, {
            preserveScroll: true,
        });
    };

    const stats = {
        total: notificationsList.length,
        unread: notificationsList.filter(n => !n.read_at).length,
        read: notificationsList.filter(n => n.read_at).length,
        messages: notificationsList.filter(n => n.type === 'message').length,
    };

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
                                onClick={handleMarkAllAsRead}
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
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#7C3AED'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#8B5CF6'; }}
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
                    {[
                        { icon: Bell, value: stats.total, label: 'Total Notifications', bg: '#EFF6FF', color: '#3B82F6' },
                        { icon: AlertCircle, value: stats.unread, label: 'Unread', bg: '#FEF3C7', color: '#F59E0B' },
                        { icon: CheckCircle, value: stats.read, label: 'Read', bg: '#ECFDF5', color: '#10B981' },
                        { icon: MessageSquare, value: stats.messages, label: 'Messages', bg: '#F3E8FF', color: '#8B5CF6' },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            background: '#FFFFFF',
                            border: '1px solid #F3F4F6',
                            borderRadius: '12px',
                            padding: '20px',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '48px', height: '48px', background: stat.bg,
                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 12px'
                            }}>
                                <stat.icon size={24} style={{ color: stat.color }} />
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{stat.value}</div>
                            <div style={{ fontSize: '14px', color: '#6B7280' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Notifications List */}
                <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #F3F4F6',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    {notificationsList.length === 0 ? (
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
                            {notificationsList.map(notification => (
                                <div
                                    key={notification.id}
                                    style={{
                                        borderLeft: `4px solid ${getTypeColor(notification.type)}`,
                                        background: notification.read_at ? '#F9FAFB' : '#FFFFFF',
                                        padding: '16px 20px',
                                        borderBottom: '1px solid #F3F4F6',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <div style={{ flexShrink: 0, marginTop: 2 }}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <h4 style={{
                                                    fontSize: '14px', fontWeight: 600,
                                                    color: '#111827', margin: 0, lineHeight: 1.4
                                                }}>
                                                    {notification.title}
                                                </h4>
                                                {!notification.read_at && (
                                                    <span style={{
                                                        width: '8px', height: '8px',
                                                        background: '#3B82F6', borderRadius: '50%',
                                                        flexShrink: 0
                                                    }} />
                                                )}
                                            </div>
                                            <p style={{
                                                fontSize: '13px', color: '#6B7280',
                                                margin: '0 0 8px 0', lineHeight: 1.4
                                            }}>
                                                {notification.message}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </span>
                                                {notification.sender && (
                                                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                                                        From: {notification.sender.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(notification.id);
                                            }}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                padding: '4px', borderRadius: '4px', color: '#9CA3AF',
                                                flexShrink: 0
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#9CA3AF'; }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {paginatedNotifications?.last_page > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                        {paginatedNotifications.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    background: link.active ? '#8B5CF6' : '#FFFFFF',
                                    color: link.active ? '#FFFFFF' : '#374151',
                                    border: '1px solid #E5E7EB',
                                    textDecoration: 'none',
                                    opacity: link.url ? 1 : 0.5,
                                    pointerEvents: link.url ? 'auto' : 'none',
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}