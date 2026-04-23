import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import { Send, Users, MessageSquare, AlertCircle, CheckCircle, Search, Filter } from 'lucide-react';

export default function Messaging({ users, recentMessages }) {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        recipient_type: 'individual', // 'individual' or 'all'
        recipient_ids: [],
        title: '',
        message: '',
        type: 'message', // 'message', 'warning', 'info'
    });

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleUserSelect = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        const formData = {
            ...data,
            recipient_ids: selectedUsers,
        };

        post('/admin/messages/send', {
            data: formData,
            onSuccess: () => {
                reset();
                setSelectedUsers([]);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        });
    };

    const handleSendToAll = (e) => {
        e.preventDefault();

        post('/admin/messages/send-to-all', {
            data: {
                title: data.title,
                message: data.message,
                type: data.type,
            },
            onSuccess: () => {
                reset();
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        });
    };

    return (
        <AdminLayout title="Messaging">
            <Head title="Admin Messaging" />

            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 800,
                        color: '#111827',
                        margin: '0 0 8px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <MessageSquare size={28} style={{ color: '#8B5CF6' }} />
                        Send Messages
                    </h1>
                    <p style={{ color: '#6B7280', margin: 0 }}>
                        Communicate with users and sellers through the notification system
                    </p>
                </div>

                {showSuccess && (
                    <div style={{
                        background: '#ECFDF5',
                        border: '1px solid #10B981',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <CheckCircle size={20} style={{ color: '#10B981' }} />
                        <span style={{ color: '#065F46', fontWeight: 500 }}>
                            Message sent successfully!
                        </span>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
                    {/* Message Form */}
                    <div style={{
                        background: '#FFFFFF',
                        border: '1px solid #F3F4F6',
                        borderRadius: '12px',
                        padding: '24px'
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#111827',
                            margin: '0 0 20px 0'
                        }}>
                            Compose Message
                        </h2>

                        <form onSubmit={data.recipient_type === 'all' ? handleSendToAll : handleSendMessage}>
                            {/* Recipient Type */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#374151',
                                    marginBottom: '8px'
                                }}>
                                    Send to
                                </label>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="recipient_type"
                                            value="individual"
                                            checked={data.recipient_type === 'individual'}
                                            onChange={(e) => setData('recipient_type', e.target.value)}
                                        />
                                        <span>Selected Users ({selectedUsers.length})</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="recipient_type"
                                            value="all"
                                            checked={data.recipient_type === 'all'}
                                            onChange={(e) => setData('recipient_type', e.target.value)}
                                        />
                                        <span>All Users</span>
                                    </label>
                                </div>
                            </div>

                            {/* Message Type */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#374151',
                                    marginBottom: '8px'
                                }}>
                                    Message Type
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        background: '#FFFFFF'
                                    }}
                                >
                                    <option value="message">General Message</option>
                                    <option value="info">Information</option>
                                    <option value="warning">Warning</option>
                                    <option value="success">Success</option>
                                </select>
                            </div>

                            {/* Title */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#374151',
                                    marginBottom: '8px'
                                }}>
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter message title"
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                    required
                                />
                                {errors.title && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.title}</span>}
                            </div>

                            {/* Message */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#374151',
                                    marginBottom: '8px'
                                }}>
                                    Message *
                                </label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Enter your message..."
                                    rows={6}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        resize: 'vertical'
                                    }}
                                    required
                                />
                                {errors.message && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.message}</span>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || (data.recipient_type === 'individual' && selectedUsers.length === 0)}
                                style={{
                                    background: '#8B5CF6',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s',
                                    opacity: (processing || (data.recipient_type === 'individual' && selectedUsers.length === 0)) ? 0.6 : 1
                                }}
                                onMouseEnter={(e) => !processing && e.target.style.background = '#7C3AED'}
                                onMouseLeave={(e) => !processing && e.target.style.background = '#8B5CF6'}
                            >
                                <Send size={16} />
                                {processing ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* User Selection Panel */}
                    {data.recipient_type === 'individual' && (
                        <div style={{
                            background: '#FFFFFF',
                            border: '1px solid #F3F4F6',
                            borderRadius: '12px',
                            padding: '24px',
                            height: 'fit-content'
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: 700,
                                color: '#111827',
                                margin: '0 0 20px 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Users size={20} />
                                Select Recipients ({selectedUsers.length})
                            </h3>

                            {/* Search and Filter */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <Search size={16} style={{
                                            position: 'absolute',
                                            left: '12px',
                                            color: '#9CA3AF'
                                        }} />
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px 8px 36px',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '6px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            background: '#FFFFFF'
                                        }}
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="user">Users</option>
                                        <option value="seller">Sellers</option>
                                        <option value="admin">Admins</option>
                                    </select>
                                </div>
                            </div>

                            {/* User List */}
                            <div style={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                border: '1px solid #F3F4F6',
                                borderRadius: '8px'
                            }}>
                                {filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleUserSelect(user.id)}
                                        style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid #F3F4F6',
                                            cursor: 'pointer',
                                            background: selectedUsers.includes(user.id) ? '#F3E8FF' : '#FFFFFF',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = selectedUsers.includes(user.id) ? '#F3E8FF' : '#F9FAFB'}
                                        onMouseLeave={(e) => e.target.style.background = selectedUsers.includes(user.id) ? '#F3E8FF' : '#FFFFFF'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => {}} // Handled by parent onClick
                                                style={{ margin: 0 }}
                                            />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: '#111827',
                                                    marginBottom: '2px'
                                                }}>
                                                    {user.name}
                                                </div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#6B7280'
                                                }}>
                                                    {user.email} • {user.role}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredUsers.length === 0 && (
                                    <div style={{
                                        padding: '40px 20px',
                                        textAlign: 'center',
                                        color: '#9CA3AF'
                                    }}>
                                        <Users size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                                        <p style={{ margin: 0, fontSize: '14px' }}>No users found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Messages */}
                {recentMessages && recentMessages.length > 0 && (
                    <div style={{
                        background: '#FFFFFF',
                        border: '1px solid #F3F4F6',
                        borderRadius: '12px',
                        padding: '24px',
                        marginTop: '24px'
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#111827',
                            margin: '0 0 20px 0'
                        }}>
                            Recent Messages
                        </h3>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            {recentMessages.slice(0, 5).map(message => (
                                <div key={message.id} style={{
                                    padding: '16px',
                                    border: '1px solid #F3F4F6',
                                    borderRadius: '8px',
                                    background: '#F9FAFB'
                                }}>
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#111827',
                                        marginBottom: '4px'
                                    }}>
                                        {message.title}
                                    </div>
                                    <div style={{
                                        fontSize: '13px',
                                        color: '#6B7280',
                                        marginBottom: '8px'
                                    }}>
                                        {message.message}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#9CA3AF'
                                    }}>
                                        Sent {new Date(message.created_at).toLocaleString()} • {message.recipient_count} recipients
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}