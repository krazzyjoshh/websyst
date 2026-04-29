import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import SellerLayout from '../../Components/SellerLayout';
import { Store, Save, Upload, Edit3, X } from 'lucide-react';
import '../../Pages/Admin/Admin.scss';

export default function SellerSettings({ profile, auth }) {
    const [editing, setEditing] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        user_name: auth.user.name,
        shop_name: profile?.shop_name || '',
        shop_description: profile?.shop_description || '',
    });
    const [shopLogoFile, setShopLogoFile] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(profile?.shop_logo || null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const data = new FormData();
        data.append('user_name', formData.user_name);
        data.append('shop_name', formData.shop_name);
        data.append('shop_description', formData.shop_description || '');
        if (shopLogoFile) {
            data.append('shop_logo', shopLogoFile);
        }

        router.post(route('seller.settings.update'), data, {
            forceFormData: true,
            onSuccess: () => {
                setEditing(false);
                setProcessing(false);
                setShopLogoFile(null);
            },
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
        });
    };

    const handleCancel = () => {
        setFormData({
            user_name: auth.user.name,
            shop_name: profile?.shop_name || '',
            shop_description: profile?.shop_description || '',
        });
        setShopLogoFile(null);
        setPreviewLogo(profile?.shop_logo || null);
        setErrors({});
        setEditing(false);
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setShopLogoFile(file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const setData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <SellerLayout title="Shop Settings">
            <Head title="Seller - Settings" />

            <div style={{ padding: 0, fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    maxWidth: '700px',
                    margin: 0,
                    padding: '36px 32px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                        <h1 style={{
                            fontSize: '26px',
                            fontWeight: 700,
                            color: '#111827',
                            letterSpacing: '-0.5px',
                            margin: 0,
                        }}>Shop Settings</h1>

                        {!editing && (
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    padding: '10px 20px',
                                    border: '1.5px solid #8B5CF6',
                                    borderRadius: 8,
                                    background: '#F5F3FF',
                                    color: '#8B5CF6',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#8B5CF6'; e.currentTarget.style.color = '#FFF'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F3FF'; e.currentTarget.style.color = '#8B5CF6'; }}
                            >
                                <Edit3 size={16} />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Owner & Shop Name Section */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 24,
                            marginBottom: 32,
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label htmlFor="owner-name" style={{
                                    fontSize: 13, fontWeight: 600, color: '#374151',
                                    textTransform: 'uppercase', letterSpacing: '0.5px',
                                }}>Owner Name</label>
                                <input
                                    id="owner-name"
                                    type="text"
                                    value={formData.user_name}
                                    onChange={e => setData('user_name', e.target.value)}
                                    disabled={!editing}
                                    required
                                    style={{
                                        fontSize: 14,
                                        padding: '11px 13px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: 8,
                                        fontFamily: 'Inter, system-ui, sans-serif',
                                        outline: 'none',
                                        backgroundColor: editing ? '#FFFFFF' : '#F3F4F6',
                                        color: editing ? '#111827' : '#6B7280',
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                                {errors.user_name && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.user_name}</span>}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label htmlFor="shop-name" style={{
                                    fontSize: 13, fontWeight: 600, color: '#374151',
                                    textTransform: 'uppercase', letterSpacing: '0.5px',
                                }}>Shop / Business Name</label>
                                <input
                                    id="shop-name"
                                    type="text"
                                    value={formData.shop_name}
                                    onChange={e => setData('shop_name', e.target.value)}
                                    disabled={!editing}
                                    required
                                    style={{
                                        fontSize: 14,
                                        padding: '11px 13px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: 8,
                                        fontFamily: 'Inter, system-ui, sans-serif',
                                        outline: 'none',
                                        backgroundColor: editing ? '#FFFFFF' : '#F3F4F6',
                                        color: editing ? '#111827' : '#6B7280',
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                                {errors.shop_name && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.shop_name}</span>}
                            </div>
                        </div>

                        {/* Logo Upload Section */}
                        <div style={{ marginBottom: 32 }}>
                            <label style={{
                                fontSize: 13, fontWeight: 600, color: '#374151',
                                textTransform: 'uppercase', letterSpacing: '0.5px',
                            }}>Shop Logo</label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 24,
                                padding: 24,
                                background: '#FAFAFA',
                                borderRadius: 10,
                                border: '1px solid #E5E7EB',
                                marginTop: 12,
                            }}>
                                <div style={{
                                    width: 96,
                                    height: 96,
                                    borderRadius: 10,
                                    background: '#F3F4F6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    border: '2px solid #E5E7EB',
                                    flexShrink: 0,
                                }}>
                                    {previewLogo ? (
                                        <img src={previewLogo} alt="Shop Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Store size={40} style={{ color: '#D1D5DB' }} />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input
                                        ref={fileInputRef}
                                        id="shop-logo"
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/gif"
                                        onChange={handleLogoChange}
                                        disabled={!editing}
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={!editing}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            padding: '10px 18px',
                                            border: '1.5px solid #D1D5DB',
                                            borderRadius: 8,
                                            background: editing ? '#FFFFFF' : '#F3F4F6',
                                            color: editing ? '#374151' : '#9CA3AF',
                                            cursor: editing ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.2s ease',
                                            fontFamily: 'Inter, system-ui, sans-serif',
                                        }}
                                    >
                                        <Upload size={16} />
                                        {shopLogoFile ? 'Change File' : 'Choose File'}
                                    </button>
                                    {shopLogoFile && (
                                        <p style={{ fontSize: 12, color: '#10B981', marginTop: 6, fontWeight: 600 }}>
                                            ✓ {shopLogoFile.name}
                                        </p>
                                    )}
                                    <p style={{ fontSize: 12, color: '#6B7280', marginTop: 9, lineHeight: 1.5 }}>
                                        Recommended: 256×256px · Max: 2MB · JPG, PNG, GIF
                                    </p>
                                </div>
                            </div>
                            {errors.shop_logo && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' }}>{errors.shop_logo}</span>}
                        </div>

                        {/* Description Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                            <label htmlFor="shop-description" style={{
                                fontSize: 13, fontWeight: 600, color: '#374151',
                                textTransform: 'uppercase', letterSpacing: '0.5px',
                            }}>Shop Description</label>
                            <textarea
                                id="shop-description"
                                value={formData.shop_description}
                                onChange={e => setData('shop_description', e.target.value)}
                                disabled={!editing}
                                placeholder="Tell customers about your store…"
                                style={{
                                    fontSize: 14,
                                    padding: '11px 13px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: 8,
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    resize: 'vertical',
                                    minHeight: 110,
                                    outline: 'none',
                                    backgroundColor: editing ? '#FFFFFF' : '#F3F4F6',
                                    color: editing ? '#111827' : '#6B7280',
                                    transition: 'all 0.2s ease',
                                    lineHeight: 1.5,
                                }}
                            />
                            {errors.shop_description && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.shop_description}</span>}
                        </div>

                        {/* Buttons */}
                        {editing && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 12,
                                paddingTop: 28,
                                marginTop: 8,
                                borderTop: '1px solid #E5E7EB',
                            }}>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={processing}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        fontSize: 15,
                                        fontWeight: 600,
                                        padding: '11px 22px',
                                        border: '1.5px solid #D1D5DB',
                                        borderRadius: 8,
                                        background: '#FFFFFF',
                                        color: '#374151',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontFamily: 'Inter, system-ui, sans-serif',
                                    }}
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        fontSize: 15,
                                        fontWeight: 600,
                                        padding: '11px 26px',
                                        border: 'none',
                                        borderRadius: 8,
                                        background: '#8B5CF6',
                                        color: '#FFFFFF',
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontFamily: 'Inter, system-ui, sans-serif',
                                        opacity: processing ? 0.6 : 1,
                                    }}
                                    onMouseEnter={(e) => { if (!processing) e.currentTarget.style.background = '#7C3AED'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#8B5CF6'; }}
                                >
                                    <Save size={18} />
                                    {processing ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </SellerLayout>
    );
}
