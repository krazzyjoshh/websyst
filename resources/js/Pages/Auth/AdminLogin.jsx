import React from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import './Auth.scss';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="auth-page">
            <Head title="Admin Login" />
            <div className="auth-page__bg">
                <div className="auth-page__orb auth-page__orb--1" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.5), transparent 70%)' }} />
                <div className="auth-page__orb auth-page__orb--2" style={{ background: 'radial-gradient(circle, rgba(185,28,28,0.3), transparent 70%)' }} />
            </div>

            <div className="auth-card glass-card">
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
                    <h1 className="auth-card__title">Admin Sign In</h1>
                    <p className="auth-card__subtitle">Access the admin dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-card__form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 }}>
                                <Mail size={17} style={{ color: '#9CA3AF' }} />
                            </div>
                            <input
                                type="email"
                                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                                style={{ paddingLeft: 46 }}
                                placeholder="admin@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 }}>
                                <Lock size={17} style={{ color: '#9CA3AF' }} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                                style={{ paddingLeft: 46, paddingRight: 46 }}
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button type="button" style={{ position: 'absolute', right: 14, background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', zIndex: 2 }} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>

                    {errors.email && !errors.password && (
                        <div style={{ padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, borderLeft: '3px solid #EF4444', marginBottom: 16, fontSize: 13, color: '#B91C1C' }}>
                            Invalid credentials or not an admin account.
                        </div>
                    )}

                    <button type="submit" className="btn-primary auth-card__submit" disabled={processing} style={{ background: '#DC2626' }}>
                        {processing ? 'Signing in...' : 'Sign In as Admin'}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: '#9CA3AF' }}>
                    Customer?{' '}
                    <Link href="/login" style={{ color: '#6B7280', fontWeight: 600 }}>Login here</Link>
                </p>
            </div>
        </div>
    );
}
