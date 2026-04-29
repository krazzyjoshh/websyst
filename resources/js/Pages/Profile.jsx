import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Layout from '../Components/Layout';
import { User, Lock, Save, Camera, Edit3 } from 'lucide-react';
import './Cart.scss';

export default function Profile({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: user.name || '', phone: user.phone || '', address: user.address || '',
        city: user.city || '', province: user.province || '', zip_code: user.zip_code || '', avatar: null
    });
    const [passwords, setPasswords] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const { flash } = usePage().props;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({ ...profile, avatar: file });
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => setPreviewAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const updateProfile = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(profile).forEach(key => {
            if (profile[key] !== null) formData.append(key, profile[key]);
        });
        formData.append('_method', 'put');
        router.post('/profile', formData, {
            onSuccess: () => {
                setIsEditing(false);
                setPreviewAvatar(null);
            }
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        router.put('/profile/password', passwords, {
            onSuccess: () => setPasswords({ current_password: '', password: '', password_confirmation: '' }),
        });
    };

    // Get avatar display URL
    const avatarUrl = previewAvatar || user.avatar || null;

    return (
        <Layout>
            <Head title="My Profile" />
            <div className="profile-page">
                <div className="container">
                    <h1 className="section-title">MY <span className="gradient-text">PROFILE</span></h1>

                    {flash?.success && (
                        <div style={{
                            background: '#ECFDF5', border: '1px solid #10B981', borderRadius: '8px',
                            padding: '12px 16px', marginBottom: '24px', color: '#065F46', fontSize: '14px'
                        }}>
                            ✓ {flash.success}
                        </div>
                    )}

                    <div className="profile-grid">
                        <form onSubmit={updateProfile} className="profile-card glass-card">
                            {/* Avatar Section */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                <div style={{ position: 'relative' }}>
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="Profile"
                                            style={{
                                                width: 80, height: 80, borderRadius: '50%',
                                                objectFit: 'cover', border: '3px solid #8B5CF6'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: 80, height: 80, borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '3px solid #8B5CF6'
                                        }}>
                                            <User size={36} color="#FFF" />
                                        </div>
                                    )}
                                    {isEditing && (
                                        <label style={{
                                            position: 'absolute', bottom: -2, right: -2,
                                            width: 28, height: 28, borderRadius: '50%',
                                            background: '#8B5CF6', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', border: '2px solid #1a1a2e'
                                        }}>
                                            <Camera size={14} color="#FFF" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', color: '#FFF', fontSize: '18px' }}>{user.name}</h3>
                                    <p style={{ margin: 0, color: '#A3A3A3', fontSize: '13px' }}>{user.email}</p>
                                    {isEditing && (
                                        <p style={{ margin: '4px 0 0', color: '#8B5CF6', fontSize: '12px' }}>
                                            Click camera icon to change photo
                                        </p>
                                    )}
                                </div>
                            </div>

                            <h3 className="profile-card__title">
                                <User size={18} style={{ display: 'inline', marginRight: 8 }} />Account Details
                            </h3>

                            {[
                                { label: 'Full Name', key: 'name' },
                                { label: 'Phone', key: 'phone' },
                                { label: 'Address', key: 'address' },
                                { label: 'City', key: 'city' },
                                { label: 'Province', key: 'province' },
                                { label: 'Zip Code', key: 'zip_code' },
                            ].map(({ label, key }) => (
                                <div key={key} className="form-group">
                                    <label>{label}</label>
                                    <input
                                        className="form-input"
                                        value={profile[key]}
                                        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                        disabled={!isEditing}
                                        style={{ opacity: isEditing ? 1 : 0.7 }}
                                    />
                                </div>
                            ))}

                            {isEditing ? (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="submit" className="btn-primary">
                                        <Save size={16} /> Save
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        style={{ background: '#374151' }}
                                        onClick={() => {
                                            setIsEditing(false);
                                            setPreviewAvatar(null);
                                            setProfile({
                                                name: user.name || '', phone: user.phone || '',
                                                address: user.address || '', city: user.city || '',
                                                province: user.province || '', zip_code: user.zip_code || '',
                                                avatar: null
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit3 size={16} /> Edit Profile
                                </button>
                            )}
                        </form>

                        <form onSubmit={updatePassword} className="profile-card glass-card">
                            <h3 className="profile-card__title"><Lock size={18} style={{ display: 'inline', marginRight: 8 }} />Change Password</h3>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input type="password" className="form-input" value={passwords.current_password} onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" className="form-input" value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input type="password" className="form-input" value={passwords.password_confirmation} onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })} />
                            </div>
                            <button type="submit" className="btn-primary"><Lock size={16} /> Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
