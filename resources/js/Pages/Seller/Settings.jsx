import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '../../Components/SellerLayout';
import { Store, Save, Upload } from 'lucide-react';
import '../../Pages/Admin/Admin.scss';

export default function SellerSettings({ profile, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        user_name: auth.user.name,
        shop_name: profile?.shop_name || '',
        shop_description: profile?.shop_description || '',
        shop_logo: null,
    });

    const [previewLogo, setPreviewLogo] = useState(profile?.shop_logo || null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('seller.settings.update'), {
            forceFormData: true,
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('shop_logo', file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const containerStyle = {
        padding: '0',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    };

    const cardStyle = {
        background: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        maxWidth: '700px',
        margin: '0',
        padding: '36px 32px',
    };

    const headingStyle = {
        fontSize: '26px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '28px',
        letterSpacing: '-0.5px',
    };

    const sectionStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
    };

    const formGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    };

    const labelStyle = {
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const descriptionLabelStyle = {
        ...labelStyle,
        marginBottom: '8px',
        display: 'block',
    };

    const descriptionGroupStyle = {
        ...formGroupStyle,
        marginBottom: '32px',
    };

    const inputStyle = {
        fontSize: '14px',
        padding: '11px 13px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        transition: 'all 0.2s ease',
        outline: 'none',
        backgroundColor: '#FAFAFA',
        lineHeight: '1.5',
    };

    const inputHoverStyle = {
        ...inputStyle,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
    };

    const inputFocusStyle = {
        ...inputStyle,
        borderColor: '#8B5CF6',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
    };

    const errorStyle = {
        fontSize: '12px',
        color: '#DC2626',
        marginTop: '4px',
    };

    const logoUploadStyle = {
        marginBottom: '32px',
    };

    const logoPreviewContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '24px',
        background: '#FAFAFA',
        borderRadius: '10px',
        border: '1px solid #E5E7EB',
        marginTop: '12px',
    };

    const logoImageStyle = {
        width: '96px',
        height: '96px',
        borderRadius: '10px',
        background: '#F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '2px solid #E5E7EB',
    };

    const logoSubmittedImageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    };

    const uploadAreaStyle = {
        flex: 1,
    };

    const uploadButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '10px 18px',
        border: '1.5px solid #D1D5DB',
        borderRadius: '8px',
        background: '#FFFFFF',
        color: '#374151',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    };

    const uploadButtonHoverStyle = {
        ...uploadButtonStyle,
        borderColor: '#8B5CF6',
        color: '#8B5CF6',
        background: '#F5F3FF',
    };

    const restrictionTextStyle = {
        fontSize: '12px',
        color: '#6B7280',
        marginTop: '9px',
        lineHeight: '1.5',
    };

    const textareaStyle = {
        fontSize: '14px',
        padding: '11px 13px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        resize: 'vertical',
        minHeight: '110px',
        transition: 'all 0.2s ease',
        outline: 'none',
        backgroundColor: '#FAFAFA',
        lineHeight: '1.5',
    };

    const textareaFocusStyle = {
        ...textareaStyle,
        borderColor: '#8B5CF6',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '28px',
        marginTop: '8px',
        borderTop: '1px solid #E5E7EB',
    };

    const submitButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '15px',
        fontWeight: '600',
        padding: '11px 26px',
        border: 'none',
        borderRadius: '8px',
        background: '#1F2937',
        color: '#FFFFFF',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        opacity: processing ? 0.6 : 1,
        pointerEvents: processing ? 'none' : 'auto',
    };

    const submitButtonHoverStyle = {
        ...submitButtonStyle,
        background: '#111827',
        boxShadow: '0 4px 12px rgba(17, 24, 39, 0.2)',
    };

    const [uploadHover, setUploadHover] = useState(false);
    const [submitHover, setSubmitHover] = useState(false);
    const [ownerFocus, setOwnerFocus] = useState(false);
    const [shopNameFocus, setShopNameFocus] = useState(false);
    const [descriptionFocus, setDescriptionFocus] = useState(false);

    return (
        <SellerLayout title="Shop Settings">
            <Head title="Seller - Settings" />

            <style>{`
                @media (max-width: 640px) {
                    #seller-settings-card {
                        padding: 24px 20px !important;
                    }
                    #seller-settings-grid {
                        grid-template-columns: 1fr !important;
                    }
                    #seller-settings-logo-container {
                        flex-direction: column;
                        align-items: flex-start !important;
                    }
                    #seller-settings-logo-image {
                        margin-bottom: 12px;
                    }
                }
            `}</style>

            <div style={containerStyle}>
                <div style={cardStyle} id="seller-settings-card">
                    <h1 style={headingStyle}>Shop Settings</h1>

                    <form onSubmit={handleSubmit}>
                        {/* Owner & Shop Name Section */}
                        <div style={sectionStyle} id="seller-settings-grid">
                            <div style={formGroupStyle}>
                                <label htmlFor="owner-name" style={labelStyle}>Owner Name</label>
                                <input
                                    id="owner-name"
                                    type="text"
                                    value={data.user_name}
                                    onChange={e => setData('user_name', e.target.value)}
                                    onFocus={() => setOwnerFocus(true)}
                                    onBlur={() => setOwnerFocus(false)}
                                    style={ownerFocus ? inputFocusStyle : inputHoverStyle}
                                    required
                                />
                                {errors.user_name && <span style={errorStyle}>{errors.user_name}</span>}
                            </div>

                            <div style={formGroupStyle}>
                                <label htmlFor="shop-name" style={labelStyle}>Shop / Business Name</label>
                                <input
                                    id="shop-name"
                                    type="text"
                                    value={data.shop_name}
                                    onChange={e => setData('shop_name', e.target.value)}
                                    onFocus={() => setShopNameFocus(true)}
                                    onBlur={() => setShopNameFocus(false)}
                                    style={shopNameFocus ? inputFocusStyle : inputHoverStyle}
                                    required
                                />
                                {errors.shop_name && <span style={errorStyle}>{errors.shop_name}</span>}
                            </div>
                        </div>

                        {/* Logo Upload Section */}
                        <div style={logoUploadStyle}>
                            <label style={labelStyle} htmlFor="shop-logo">Shop Logo</label>
                            <div style={logoPreviewContainerStyle} id="seller-settings-logo-container">
                                <div style={logoImageStyle} id="seller-settings-logo-image">
                                    {previewLogo ? (
                                        <img src={previewLogo} alt="Shop Logo Preview" style={logoSubmittedImageStyle} />
                                    ) : (
                                        <Store size={40} style={{ color: '#D1D5DB' }} />
                                    )}
                                </div>
                                <div style={uploadAreaStyle}>
                                    <input
                                        id="shop-logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        style={{ display: 'none' }}
                                    />
                                    <label
                                        htmlFor="shop-logo"
                                        style={uploadHover ? uploadButtonHoverStyle : uploadButtonStyle}
                                        onMouseEnter={() => setUploadHover(true)}
                                        onMouseLeave={() => setUploadHover(false)}
                                    >
                                        <Upload size={16} />
                                        Choose File
                                    </label>
                                    <p style={restrictionTextStyle}>
                                        Recommended size: 256×256px<br />
                                        Max file size: 2MB
                                    </p>
                                </div>
                            </div>
                            {errors.shop_logo && <span style={errorStyle}>{errors.shop_logo}</span>}
                        </div>

                        {/* Description Section */}
                        <div style={descriptionGroupStyle}>
                            <label htmlFor="shop-description" style={descriptionLabelStyle}>Shop Description</label>
                            <textarea
                                id="shop-description"
                                value={data.shop_description}
                                onChange={e => setData('shop_description', e.target.value)}
                                onFocus={() => setDescriptionFocus(true)}
                                onBlur={() => setDescriptionFocus(false)}
                                placeholder="Tell customers about your store…"
                                style={descriptionFocus ? textareaFocusStyle : textareaStyle}
                            />
                            {errors.shop_description && <span style={errorStyle}>{errors.shop_description}</span>}
                        </div>

                        {/* Submit Button */}
                        <div style={buttonContainerStyle}>
                            <button
                                type="submit"
                                disabled={processing}
                                style={submitHover ? submitButtonHoverStyle : submitButtonStyle}
                                onMouseEnter={() => setSubmitHover(true)}
                                onMouseLeave={() => setSubmitHover(false)}
                            >
                                <Save size={18} />
                                {processing ? 'Saving…' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SellerLayout>
    );
}
