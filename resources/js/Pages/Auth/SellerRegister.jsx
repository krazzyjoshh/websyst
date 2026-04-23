import React from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Store, Building2, Check, Phone, MapPin } from 'lucide-react';
import './Auth.scss';

export default function SellerRegister() {
    const [step, setStep] = React.useState(1); // 1: personal, 2: store, 3: address, 4: OTP
    const [otpSent, setOtpSent] = React.useState(false);
    const [otpError, setOtpError] = React.useState('');
    const [sendingOTP, setSendingOTP] = React.useState(false);
    const [otpResendCooldown, setOtpResendCooldown] = React.useState(0);
    
    const { data, setData, processing, errors } = useForm({
        // Personal Info
        first_name: '',
        last_name: '',
        email: '',
        gender: '',
        date_of_birth: '',
        phone_country_code: '+63',
        phone: '',
        alternative_email: '',
        
        // Address
        street_address: '',
        barangay: '',
        city: '',
        province: '',
        zip_code: '',
        country: 'Philippines',
        
        // Store Info
        store_name: '',
        store_description: '',
        
        // Account
        password: '',
        password_confirmation: '',
        
        // Agreement
        agree_terms: false,
        
        // OTP
        otp: '',
    });
    
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    // OTP Resend cooldown timer
    React.useEffect(() => {
        if (otpResendCooldown > 0) {
            const timer = setTimeout(() => setOtpResendCooldown(otpResendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpResendCooldown]);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setOtpError('');
        setSendingOTP(true);
        
        try {
            const response = await fetch('/seller/register/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    gender: data.gender,
                    date_of_birth: data.date_of_birth,
                    phone: data.phone,
                    phone_country_code: data.phone_country_code,
                    alternative_email: data.alternative_email,
                    street_address: data.street_address,
                    barangay: data.barangay,
                    city: data.city,
                    province: data.province,
                    zip_code: data.zip_code,
                    country: data.country,
                    store_name: data.store_name,
                    store_description: data.store_description,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                    agree_terms: data.agree_terms,
                }),
            });

            const result = await response.json();
            
            if (!response.ok) {
                setOtpError(result.message || 'Failed to send OTP. Please try again.');
                setSendingOTP(false);
                return;
            }

            setOtpSent(true);
            setOtpResendCooldown(30);
            setStep(4);
            setSendingOTP(false);
        } catch (error) {
            setOtpError('An error occurred. Please try again.');
            setSendingOTP(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setOtpError('');
        
        try {
            const response = await fetch('/seller/register/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    gender: data.gender,
                    date_of_birth: data.date_of_birth,
                    phone: data.phone,
                    phone_country_code: data.phone_country_code,
                    alternative_email: data.alternative_email,
                    street_address: data.street_address,
                    barangay: data.barangay,
                    city: data.city,
                    province: data.province,
                    zip_code: data.zip_code,
                    country: data.country,
                    store_name: data.store_name,
                    store_description: data.store_description,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                    otp: data.otp,
                }),
            });

            const result = await response.json();
            
            if (!response.ok) {
                setOtpError(result.message || 'Failed to verify OTP. Please try again.');
                return;
            }

            if (result.redirect) {
                window.location.href = result.redirect;
            }
        } catch (error) {
            setOtpError('An error occurred. Please try again.');
        }
    };

    const isStep1Valid = data.first_name && data.last_name && data.email && data.gender && data.date_of_birth && data.phone;
    const isStep2Valid = data.store_name;
    const isStep3Valid = data.street_address && data.barangay && data.city && data.province && data.zip_code && data.country;
    const isStep4Valid = data.password && data.password === data.password_confirmation && data.agree_terms;

    return (
        <div className="auth-page">
            <Head title="Become a Seller" />
            <div className="auth-page__bg">
                <div className="auth-page__orb auth-page__orb--1" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.5), transparent 70%)' }} />
                <div className="auth-page__orb auth-page__orb--2" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)' }} />
            </div>

            <div className="auth-card glass-card" style={{ maxWidth: 600 }}>
                <div className="auth-card__header">
                    <Link href="/" className="auth-card__logo">
                        <span className="auth-card__logo-text">SHOP</span>
                        <span className="auth-card__logo-accent">HUB</span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                        <div style={{ background: '#EDE9FE', borderRadius: 10, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <Store size={18} style={{ color: '#7C3AED' }} />
                            <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: 13 }}>Seller Portal</span>
                        </div>
                    </div>
                    <h1 className="auth-card__title">Become a Seller</h1>
                    <p className="auth-card__subtitle">Step {step === 4 && otpSent ? 3 : step} of 3</p>
                </div>

                {/* Info banner */}
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#166534' }}>
                    📋 Your account will be reviewed by admin before activation.
                </div>

                <form onSubmit={step === 4 ? handleVerifyOTP : handleSendOTP} className="auth-card__form">
                    {step === 1 && (
                        <>
                            <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}>Personal Information</h3>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <div className="input-icon-wrapper">
                                        <User size={18} className="input-icon" />
                                        <input
                                            type="text"
                                            className={`form-input form-input--icon ${errors.first_name ? 'form-input--error' : ''}`}
                                            placeholder="John"
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
                                            placeholder="Doe"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                        />
                                    </div>
                                    {errors.last_name && <span className="form-error">{errors.last_name}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address *</label>
                                <div className="input-icon-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        className={`form-input form-input--icon ${errors.email ? 'form-input--error' : ''}`}
                                        placeholder="seller@example.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                                {errors.email && <span className="form-error">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label>Gender *</label>
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

                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label>Country Code *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={data.phone_country_code}
                                        onChange={(e) => setData('phone_country_code', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number *</label>
                                    <div className="input-icon-wrapper">
                                        <Phone size={18} className="input-icon" />
                                        <input
                                            type="tel"
                                            className={`form-input form-input--icon ${errors.phone ? 'form-input--error' : ''}`}
                                            placeholder="9123456789"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {errors.phone && <span className="form-error">{errors.phone}</span>}

                            <button 
                                type="button" 
                                onClick={() => setStep(2)}
                                disabled={!isStep1Valid}
                                className="btn-primary auth-card__submit"
                                style={{ background: '#7C3AED' }}
                            >
                                Next: Store Information
                                <ArrowRight size={18} />
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}>Store Information</h3>
                            
                            <div className="form-group">
                                <label>Store Name *</label>
                                <div className="input-icon-wrapper">
                                    <Store size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        className={`form-input form-input--icon ${errors.store_name ? 'form-input--error' : ''}`}
                                        placeholder="My Amazing Store"
                                        value={data.store_name}
                                        onChange={(e) => setData('store_name', e.target.value)}
                                    />
                                </div>
                                {errors.store_name && <span className="form-error">{errors.store_name}</span>}
                            </div>

                            <div className="form-group">
                                <label>Store Description</label>
                                <textarea
                                    className="form-input"
                                    placeholder="Tell us about your store..."
                                    rows="4"
                                    value={data.store_description}
                                    onChange={(e) => setData('store_description', e.target.value)}
                                    style={{ fontFamily: 'inherit' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <button 
                                    type="button" 
                                    onClick={() => setStep(1)}
                                    className="btn-secondary"
                                    style={{ background: '#F3F4F6', color: '#374151' }}
                                >
                                    Back
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setStep(3)}
                                    disabled={!isStep2Valid}
                                    className="btn-primary"
                                    style={{ background: '#7C3AED' }}
                                >
                                    Next: Address
                                </button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}>Business Address</h3>
                            
                            <div className="form-group">
                                <label>Street Address *</label>
                                <div className="input-icon-wrapper">
                                    <MapPin size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        className={`form-input form-input--icon ${errors.street_address ? 'form-input--error' : ''}`}
                                        placeholder="123 Business Street"
                                        value={data.street_address}
                                        onChange={(e) => setData('street_address', e.target.value)}
                                    />
                                </div>
                                {errors.street_address && <span className="form-error">{errors.street_address}</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label>Barangay/District *</label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors.barangay ? 'form-input--error' : ''}`}
                                        placeholder="Barangay"
                                        value={data.barangay}
                                        onChange={(e) => setData('barangay', e.target.value)}
                                    />
                                    {errors.barangay && <span className="form-error">{errors.barangay}</span>}
                                </div>

                                <div className="form-group">
                                    <label>City/Municipality *</label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors.city ? 'form-input--error' : ''}`}
                                        placeholder="City"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                    />
                                    {errors.city && <span className="form-error">{errors.city}</span>}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label>Province/State *</label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors.province ? 'form-input--error' : ''}`}
                                        placeholder="Province"
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                    />
                                    {errors.province && <span className="form-error">{errors.province}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Postal/Zip Code *</label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors.zip_code ? 'form-input--error' : ''}`}
                                        placeholder="12345"
                                        value={data.zip_code}
                                        onChange={(e) => setData('zip_code', e.target.value)}
                                    />
                                    {errors.zip_code && <span className="form-error">{errors.zip_code}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Country *</label>
                                <select
                                    className={`form-input ${errors.country ? 'form-input--error' : ''}`}
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                >
                                    <option value="Philippines">Philippines</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="Malaysia">Malaysia</option>
                                    <option value="Thailand">Thailand</option>
                                </select>
                                {errors.country && <span className="form-error">{errors.country}</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <button 
                                    type="button" 
                                    onClick={() => setStep(2)}
                                    className="btn-secondary"
                                    style={{ background: '#F3F4F6', color: '#374151' }}
                                >
                                    Back
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setStep(4)}
                                    disabled={!isStep3Valid}
                                    className="btn-primary"
                                    style={{ background: '#7C3AED' }}
                                >
                                    Next: Security
                                </button>
                            </div>
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}>Account Security</h3>
                            
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
                                        placeholder="Confirm your password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <button type="button" className="input-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {data.password !== data.password_confirmation && data.password_confirmation && (
                                    <span className="form-error">Passwords do not match</span>
                                )}
                            </div>

                            <div className="form-group" style={{ marginTop: 20 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.agree_terms}
                                        onChange={(e) => setData('agree_terms', e.target.checked)}
                                        style={{ width: 18, height: 18, cursor: 'pointer' }}
                                    />
                                    <span>I agree to Terms & Conditions and Seller Agreement *</span>
                                </label>
                                {errors.agree_terms && <span className="form-error">{errors.agree_terms}</span>}
                            </div>

                            <button 
                                type="button" 
                                onClick={() => setStep(3)}
                                className="btn-secondary"
                                style={{ background: '#F3F4F6', color: '#374151', marginTop: 20 }}
                            >
                                Back
                            </button>

                            <button 
                                type="submit" 
                                disabled={!isStep4Valid || sendingOTP || processing}
                                className="btn-primary auth-card__submit"
                                style={{ background: '#7C3AED' }}
                            >
                                {sendingOTP || processing ? 'Sending Verification Code...' : 'Send Verification Code'}
                                <ArrowRight size={18} />
                            </button>

                            {otpSent && (
                                <>
                                    <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 24 }}>
                                        <div style={{ background: '#EDE9FE', width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Check size={28} style={{ color: '#7C3AED' }} />
                                        </div>
                                        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1F2937', marginBottom: 8 }}>Check Your Email</h2>
                                        <p style={{ color: '#6B7280', fontSize: 14 }}>We sent a verification code to {data.email}</p>
                                    </div>

                                    <div className="form-group">
                                        <label>Verification Code *</label>
                                        <div className="input-icon-wrapper">
                                            <Lock size={18} className="input-icon" />
                                            <input
                                                type="text"
                                                className={`form-input form-input--icon ${errors.otp ? 'form-input--error' : ''} ${otpError ? 'form-input--error' : ''}`}
                                                placeholder="Enter 6-digit code"
                                                maxLength="6"
                                                value={data.otp}
                                                onChange={(e) => setData('otp', e.target.value.replace(/\D/g, ''))}
                                            />
                                        </div>
                                        {(errors.otp || otpError) && <span className="form-error">{errors.otp || otpError}</span>}
                                    </div>

                                    <button type="submit" className="btn-primary auth-card__submit" disabled={processing || data.otp.length !== 6} style={{ background: '#7C3AED' }}>
                                        {processing ? 'Verifying...' : 'Verify & Apply as Seller'}
                                        <ArrowRight size={18} />
                                    </button>

                                    <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#6B7280' }}>
                                        Didn't receive the code?{' '}
                                        {otpResendCooldown > 0 ? (
                                            <span>Try again in {otpResendCooldown}s</span>
                                        ) : (
                                            <button 
                                                type="button" 
                                                onClick={() => { 
                                                    setOtpSent(false); 
                                                    setData('otp', '');
                                                }}
                                                style={{ color: '#7C3AED', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                Resend Code
                                            </button>
                                        )}
                                    </p>
                                </>
                            )}
                        </>
                    )}
                </form>

                <p className="auth-card__footer">
                    Already a seller?{' '}
                    <Link href="/seller/login" style={{ color: '#7C3AED', fontWeight: 600 }}>Sign In</Link>
                </p>
                <p style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: '#9CA3AF' }}>
                    Customer?{' '}
                    <Link href="/register" style={{ color: '#6B7280', fontWeight: 600 }}>Register here</Link>
                </p>
            </div>
        </div>
    );
}
