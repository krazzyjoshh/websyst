import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import { CheckCircle, XCircle, Eye, Package, AlertTriangle, Search, Filter, Clock, User } from 'lucide-react';

export default function ProductApprovals({ pendingProducts, approvedProducts, rejectedProducts }) {
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [processing, setProcessing] = useState(false);

    const getProductsForTab = () => {
        switch (activeTab) {
            case 'pending':
                return pendingProducts || [];
            case 'approved':
                return approvedProducts || [];
            case 'rejected':
                return rejectedProducts || [];
            default:
                return [];
        }
    };

    const filteredProducts = getProductsForTab().filter(approval =>
        (approval.product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (approval.seller?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApprove = (approvalId) => {
        if (confirm('Are you sure you want to approve this product?')) {
            router.post(`/admin/product-approvals/${approvalId}/approve`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleReject = (approvalId, reason) => {
        router.post(`/admin/product-approvals/${approvalId}/reject`, {
            rejection_reason: reason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowModal(false);
                setSelectedProduct(null);
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return '#10B981';
            case 'rejected':
                return '#EF4444';
            case 'pending':
            default:
                return '#F59E0B';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircle size={16} style={{ color: '#10B981' }} />;
            case 'rejected':
                return <XCircle size={16} style={{ color: '#EF4444' }} />;
            case 'pending':
            default:
                return <Clock size={16} style={{ color: '#F59E0B' }} />;
        }
    };

    const tabs = [
        { id: 'pending', label: 'Pending', count: pendingProducts?.length || 0, color: '#F59E0B' },
        { id: 'approved', label: 'Approved', count: approvedProducts?.length || 0, color: '#10B981' },
        { id: 'rejected', label: 'Rejected', count: rejectedProducts?.length || 0, color: '#EF4444' },
    ];

    return (
        <AdminLayout title="Product Approvals">
            <Head title="Product Approvals" />

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
                        <Package size={28} style={{ color: '#8B5CF6' }} />
                        Product Approvals
                    </h1>
                    <p style={{ color: '#6B7280', margin: 0 }}>
                        Review and approve products submitted by sellers
                    </p>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px'
                }}>
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                background: '#FFFFFF',
                                border: `2px solid ${activeTab === tab.id ? tab.color : '#F3F4F6'}`,
                                borderRadius: '12px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== tab.id) {
                                    e.target.style.borderColor = tab.color;
                                    e.target.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== tab.id) {
                                    e.target.style.borderColor = '#F3F4F6';
                                    e.target.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: `${tab.color}20`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 12px'
                            }}>
                                {getStatusIcon(tab.id)}
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{tab.count}</div>
                            <div style={{ fontSize: '14px', color: '#6B7280' }}>{tab.label} Products</div>
                        </div>
                    ))}
                </div>

                {/* Search and Filter */}
                <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #F3F4F6',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9CA3AF'
                            }} />
                            <input
                                type="text"
                                placeholder="Search products or sellers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 36px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Products List */}
                <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #F3F4F6',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    {filteredProducts.length === 0 ? (
                        <div style={{
                            padding: '80px 40px',
                            textAlign: 'center',
                            color: '#9CA3AF'
                        }}>
                            <Package size={64} style={{ margin: '0 auto 24px', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#6B7280', margin: '0 0 8px 0' }}>
                                No {activeTab} products
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px' }}>
                                {activeTab === 'pending' ? 'Products awaiting approval will appear here.' :
                                 activeTab === 'approved' ? 'Approved products will appear here.' :
                                 'Rejected products will appear here.'}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {filteredProducts.map(approval => (
                                <div key={approval.id} style={{
                                    padding: '20px',
                                    borderBottom: '1px solid #F3F4F6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                    {/* Product Image */}
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}>
                                        {approval.product?.images && approval.product.images[0] ? (
                                            <img
                                                src={approval.product.images[0].image_path}
                                                alt={approval.product.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                background: '#F3F4F6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Package size={24} style={{ color: '#9CA3AF' }} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: '#111827',
                                            marginBottom: '4px'
                                        }}>
                                            {approval.product?.name}
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#6B7280',
                                            marginBottom: '8px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {approval.product?.description}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            fontSize: '13px',
                                            color: '#6B7280'
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <User size={14} />
                                                {approval.seller?.name || 'Unknown Seller'}
                                            </span>
                                            <span>₱{approval.product?.price}</span>
                                            <span>{approval.product?.category?.name}</span>
                                        </div>
                                    </div>

                                    {/* Status and Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            background: `${getStatusColor(approval.status)}20`,
                                            color: getStatusColor(approval.status)
                                        }}>
                                            {getStatusIcon(approval.status)}
                                            {approval.status?.charAt(0).toUpperCase() + approval.status?.slice(1)}
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(approval);
                                                    setShowModal(true);
                                                }}
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid #D1D5DB',
                                                    borderRadius: '6px',
                                                    background: '#FFFFFF',
                                                    cursor: 'pointer',
                                                    color: '#6B7280'
                                                }}
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            {approval.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(approval.id)}
                                                        disabled={processing}
                                                        style={{
                                                            padding: '8px',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            background: '#10B981',
                                                            cursor: 'pointer',
                                                            color: '#FFFFFF'
                                                        }}
                                                        title="Approve Product"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            const reason = prompt('Reason for rejection:');
                                                            if (reason) {
                                                                handleReject(approval.id, reason);
                                                            }
                                                        }}
                                                        disabled={processing}
                                                        style={{
                                                            padding: '8px',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            background: '#EF4444',
                                                            cursor: 'pointer',
                                                            color: '#FFFFFF'
                                                        }}
                                                        title="Reject Product"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Product Details Modal */}
            {showModal && selectedProduct && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{
                            padding: '24px',
                            borderBottom: '1px solid #F3F4F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
                                Product Details
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedProduct(null);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    color: '#6B7280'
                                }}
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    {selectedProduct.product?.images && selectedProduct.product.images[0] ? (
                                        <img
                                            src={selectedProduct.product.images[0].image_path}
                                            alt={selectedProduct.product.name}
                                            style={{
                                                width: '100%',
                                                borderRadius: '8px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '150px',
                                            background: '#F3F4F6',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Package size={48} style={{ color: '#9CA3AF' }} />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>
                                        {selectedProduct.product?.name}
                                    </h3>
                                    <p style={{ color: '#6B7280', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                                        {selectedProduct.product?.description}
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                                        <div>
                                            <span style={{ fontWeight: 600, color: '#374151' }}>Price:</span>
                                            <span style={{ color: '#111827', marginLeft: '8px' }}>₱{selectedProduct.product?.price}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 600, color: '#374151' }}>Category:</span>
                                            <span style={{ color: '#111827', marginLeft: '8px' }}>{selectedProduct.product?.category?.name}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 600, color: '#374151' }}>Seller:</span>
                                            <span style={{ color: '#111827', marginLeft: '8px' }}>{selectedProduct.seller?.name}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 600, color: '#374151' }}>Status:</span>
                                            <span style={{
                                                color: getStatusColor(selectedProduct.status),
                                                marginLeft: '8px',
                                                fontWeight: 600
                                            }}>
                                                {selectedProduct.status?.charAt(0).toUpperCase() + selectedProduct.status?.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedProduct.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
                                    <button
                                        onClick={() => handleApprove(selectedProduct.id)}
                                        disabled={processing}
                                        style={{
                                            flex: 1,
                                            background: '#10B981',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <CheckCircle size={16} />
                                        Approve Product
                                    </button>

                                    <button
                                        onClick={() => {
                                            const reason = prompt('Reason for rejection:');
                                            if (reason) {
                                                handleReject(selectedProduct.id, reason);
                                                setShowModal(false);
                                                setSelectedProduct(null);
                                            }
                                        }}
                                        disabled={processing}
                                        style={{
                                            flex: 1,
                                            background: '#EF4444',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <XCircle size={16} />
                                        Reject Product
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}