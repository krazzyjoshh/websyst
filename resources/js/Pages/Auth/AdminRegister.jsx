import React from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import './Auth.scss';

export default function AdminRegister() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        invite_code: '',
    });
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/register');
    };

    const field = (label, key, type, placeholder, icon) => (
        <div className="form-group">
            <label>{label}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 }}>
                    {icon}
                </div>
                <input
                    type={type}
                    className={`form-input ${errors[key] ? 'form-input--error' : ''}`}
                    style={{ paddingLeft: 46, paddingRight: type === 'password' ? 46 : undefined }}
                    placeholder={placeholder}
                    value={data[key]}
                    onChange={(e) => setData(key, e.target.value)}
                />
                {key === 'password' && (
                    <button type="button" style={{ position: 'absolute', right: 14, background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', zIndex: 2 }} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                )}
            </div>
            {errors[key] && <span className="form-error">{errors[key]}</span>}
        </div>
    );

    return (
        <div className="auth-page">
            <Head title="Admin Registration" />
            <div className="auth-page__bg">
                <div className="auth-page__orb auth-page__orb--1" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.5), transparent 70%)' }} />
                <div className="auth-page__orb auth-page__orb--2" style={{ background: 'radial-gradient(circle, rgba(185,28,28,0.3), transparent 70%)' }} />
            </div>

            <div className="auth-card glass-card" style={{ maxWidth: 540 }}>
                <div className="auth-card__header">
                    <Link href="/" className="auth-card__logo">
                        <span className="auth-card__logo-text">SHOP</span>
                        <span className="auth-card__logo-accent">HUB</span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                        <div style={{ background: '#FEE2E2', borderRadius: 10, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <Shield size={18} style={{ color: '#DC2626' }} />
                            <span style={{ color: '#DC2626', fontWeight: 700, fontSize: 13 }}>Admin Portal</span>
                        </div>
                    </div>
                    <h1 className="auth-card__title">Create Admin Account</h1>
                    <p className="auth-card__subtitle">Register as a new admin</p>
                </div>

                {/* Info banner */}
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#991B1B' }}>
                    🔐 Admin registration requires an invite code.
                </div>

                <form onSubmit={handleSubmit} className="auth-card__form">
                    {field('Full Name', 'name', 'text', 'Your full name', <User size={17} style={{ color: '#9CA3AF' }} />)}
                    {field('Email Address', 'email', 'email', 'admin@example.com', <Mail size={17} style={{ color: '#9CA3AF' }} />)}
                    {field('Invite Code', 'invite_code', 'text', 'Enter your admin invite code', <Shield size={17} style={{ color: '#9CA3AF' }} />)}
                    {field('Password', 'password', showPassword ? 'text' : 'password', 'Min 8 characters', <Lock size={17} style={{ color: '#9CA3AF' }} />)}
                    {field('Confirm Password', 'password_confirmation', 'password', 'Confirm your password', <Lock size={17} style={{ color: '#9CA3AF' }} />)}

                    <button type="submit" className="btn-primary auth-card__submit" disabled={processing} style={{ background: '#DC2626' }}>
                        {processing ? 'Submitting...' : 'Create Admin Account'}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <p className="auth-card__footer">
                    Already an admin?{' '}
                    <Link href="/admin/login" className="auth-card__link">Sign In</Link>
                </p>
                <p style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: '#9CA3AF' }}>
                    Customer?{' '}
                    <Link href="/register" style={{ color: '#6B7280', fontWeight: 600 }}>Register here</Link>
                </p>
            </div>
        </div>
    );
}
