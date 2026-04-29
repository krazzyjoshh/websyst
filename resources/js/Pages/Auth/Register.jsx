import React, { useState } from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, CheckCircle } from 'lucide-react';
import PHAddressSelect from '../../Components/PHAddressSelect';
import axios from 'axios';
import './Auth.scss';

export default function Register() {
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        gender: '',
        date_of_birth: '',
        street_address: '',
        barangay: '',
        city: '',
        province: '',
        password: '',
        password_confirmation: '',
        agree_terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // OTP states
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');

    const handleSendOtp = async () => {
        if (!data.email) {
            setError('email', 'Please enter your email first.');
            return;
        }
        
        setSendingOtp(true);
        clearErrors('email');
        setOtpError('');
        
        try {
            await axios.post('/send-otp', {
                email: data.email,
                role: 'customer',
                first_name: data.first_name || 'User'
            });
            setOtpSent(true);
            alert('OTP sent to your email!');
        } catch (error) {
            if (error.response?.data?.errors?.email) {
                setError('email', error.response.data.errors.email[0]);
            } else {
                setOtpError(error.response?.data?.message || 'Failed to send OTP.');
            }
        } finally {
            setSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setOtpError('Please enter a valid 6-digit OTP.');
            return;
        }

        setVerifyingOtp(true);
        setOtpError('');

        try {
            await axios.post('/verify-otp', {
                email: data.email,
                otp: otp
            });
            setOtpVerified(true);
            setOtpError('');
            alert('Email verified successfully!');
        } catch (error) {
            setOtpError(error.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!otpVerified) {
            alert('Please verify your email with the OTP first.');
            return;
        }
        post('/register');
    };

    const isFormValid = 
        data.first_name && data.last_name && data.gender && data.date_of_birth &&
        data.email && otpVerified && data.street_address && data.barangay && data.city &&
        data.province && data.password && 
        data.password === data.password_confirmation && data.agree_terms;



    return (
        <div className="auth-page">
            <Head title="Create Account" />
            <div className="auth-page__bg">
                <div className="auth-page__orb auth-page__orb--1" />
                <div className="auth-page__orb auth-page__orb--2" />
            </div>

            <div className="auth-card glass-card" style={{ maxWidth: 800, margin: '40px auto' }}>
                <div className="auth-card__header">
                    <Link href="/" className="auth-card__logo">
                        <span className="auth-card__logo-text">SHOP</span>
                        <span className="auth-card__logo-accent">HUB</span>
                    </Link>
                    <h1 className="auth-card__title">Create Account</h1>
                    <p className="auth-card__subtitle">Join us as a Customer to start shopping.</p>
                    <div style={{ marginTop: 12 }}>
                        <Link href="/seller/register" style={{ fontSize: 13, color: '#8B5CF6', textDecoration: 'none', fontWeight: 600 }}>
                            Want to sell? Register as a Seller instead →
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-card__form" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    
                    {/* SECTION: Email & Contact */}
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 16, borderBottom: '1px solid #F3F4F6', paddingBottom: 8 }}>
                            Contact Information
                        </h3>

                        <div className="form-group" style={{ marginBottom: 12 }}>
                            <label>Email Address *</label>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <div className="input-icon-wrapper" style={{ flex: 1 }}>
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        className={`form-input form-input--icon ${errors.email ? 'form-input--error' : ''}`}
                                        placeholder="your@email.com"
                                        value={data.email}
                                        onChange={(e) => {
                                            setData('email', e.target.value);
                                            setOtpSent(false);
                                            setOtpVerified(false);
                                        }}
                                        disabled={otpVerified}
                                    />
                                </div>
                                {!otpVerified && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={sendingOtp || !data.email}
                                        className="btn-primary"
                                        style={{ height: '42px', padding: '0 16px', whiteSpace: 'nowrap' }}
                                    >
                                        {sendingOtp ? 'Sending...' : (otpSent ? 'Resend OTP' : 'Send OTP')}
                                    </button>
                                )}
                                {otpVerified && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10B981', fontWeight: 600 }}>
                                        <CheckCircle size={20} /> Verified
                                    </div>
                                )}
                            </div>
                            {errors.email && <span className="form-error">{errors.email}</span>}
                        </div>

                        {otpSent && !otpVerified && (
                            <div className="form-group" style={{ marginBottom: 12, padding: '16px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <ShieldCheck size={16} style={{ color: '#8B5CF6' }} />
                                    Enter OTP Code *
                                </label>
                                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        className="form-input"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        style={{ flex: 1, letterSpacing: '4px', fontSize: '16px', textAlign: 'center', fontWeight: 'bold' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={verifyingOtp || otp.length !== 6}
                                        className="btn-primary"
                                        style={{ height: '42px', padding: '0 24px', background: '#8B5CF6' }}
                                    >
                                        {verifyingOtp ? 'Verifying...' : 'Verify'}
                                    </button>
                                </div>
                                {otpError && <span className="form-error" style={{ display: 'block', marginTop: 8 }}>{otpError}</span>}
                            </div>
                        )}
                    </div>

                    {/* SECTION: Personal Information */}
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 16, borderBottom: '1px solid #F3F4F6', paddingBottom: 8 }}>
                            Personal Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="form-group">
                                <label>First Name *</label>
                                <div className="input-icon-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        className={`form-input form-input--icon ${errors.first_name ? 'form-input--error' : ''}`}
                                        placeholder="First Name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                    />
                                </div>
                                {errors.first_name && <span className="form-error">{errors.first_name}</span>}
                            </div>

                            <div className="form-group">
                                <label>Last Name *</label>
                                <div className="input-icon-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        className={`form-input form-input--icon ${errors.last_name ? 'form-input--error' : ''}`}
                                        placeholder="Last Name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                    />
                                </div>
                                {errors.last_name && <span className="form-error">{errors.last_name}</span>}
                            </div>

                            <div className="form-group">
                                <label>Sex / Gender *</label>
                                <select
                                    className={`form-input ${errors.gender ? 'form-input--error' : ''}`}
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                                {errors.gender && <span className="form-error">{errors.gender}</span>}
                            </div>

                            <div className="form-group">
                                <label>Date of Birth *</label>
                                <input
                                    type="date"
                                    className={`form-input ${errors.date_of_birth ? 'form-input--error' : ''}`}
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                />
                                {errors.date_of_birth && <span className="form-error">{errors.date_of_birth}</span>}
                            </div>
                        </div>
                    </div>

                    {/* SECTION: Address Information */}
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 16, borderBottom: '1px solid #F3F4F6', paddingBottom: 8 }}>
                            Address Information
                        </h3>
                        <div className="form-group" style={{ marginBottom: 16 }}>
                            <label>Street Address / House Number *</label>
                            <input
                                type="text"
                                className={`form-input ${errors.street_address ? 'form-input--error' : ''}`}
                                placeholder="House No., Street Name, Subdivision"
                                value={data.street_address}
                                onChange={(e) => setData('street_address', e.target.value)}
                            />
                            {errors.street_address && <span className="form-error">{errors.street_address}</span>}
                        </div>
                        
                        <PHAddressSelect data={data} setData={setData} errors={errors} />
                    </div>

                    {/* SECTION: Security */}
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 16, borderBottom: '1px solid #F3F4F6', paddingBottom: 8 }}>
                            Account Security
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="form-group">
                                <label>Password *</label>
                                <div className="input-icon-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-input form-input--icon ${errors.password ? 'form-input--error' : ''}`}
                                        placeholder="Min 8 characters"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <span className="form-error">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label>Confirm Password *</label>
                                <div className="input-icon-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={`form-input form-input--icon ${data.password !== data.password_confirmation && data.password_confirmation ? 'form-input--error' : ''}`}
                                        placeholder="Confirm password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <button type="button" className="input-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password_confirmation && <span className="form-error">{errors.password_confirmation}</span>}
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: 24 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={data.agree_terms}
                                    onChange={(e) => setData('agree_terms', e.target.checked)}
                                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                                />
                                <span>I agree to the Terms & Conditions and Privacy Policy *</span>
                            </label>
                            {errors.agree_terms && <span className="form-error">{errors.agree_terms}</span>}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={!isFormValid || processing}
                        className="btn-primary auth-card__submit"
                        style={{ padding: '16px', fontSize: 16 }}
                    >
                        {processing ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-card__footer">
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: '#4F46E5', fontWeight: 600 }}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
