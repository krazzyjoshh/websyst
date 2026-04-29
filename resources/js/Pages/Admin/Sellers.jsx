import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import { Store, Star, CheckCircle } from 'lucide-react';
import './Admin.scss';

export default function AdminSellers({ sellers }) {
    return (
        <AdminLayout title="Sellers Management">
            <Head title="Admin - Sellers" />
            <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {sellers.map((seller) => (
                    <div key={seller.id} className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #00F0FF, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0A', fontWeight: 700, fontSize: 18 }}>
                                {seller.name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700 }}>{seller.name}</h3>
                                <p style={{ fontSize: 12, color: '#666' }}>{seller.email}</p>
                            </div>
                        </div>
                        {seller.seller_profile && (
                            <>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#00F0FF', marginBottom: 12 }}>
                                    <Store size={14} style={{ display: 'inline', marginRight: 6 }} />
                                    {seller.seller_profile.shop_name}
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, textAlign: 'center' }}>
                                        <p style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk', color: '#10B981' }}>₱{parseFloat(seller.seller_profile.total_earnings).toLocaleString()}</p>
                                        <p style={{ fontSize: 11, color: '#666' }}>Earnings</p>
                                    </div>
                                    <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, textAlign: 'center' }}>
                                        <p style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk' }}>{seller.products_count}</p>
                                        <p style={{ fontSize: 11, color: '#666' }}>Products</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
                                    <span className="badge badge-success"><Star size={12} style={{ marginRight: 4 }} />{seller.seller_profile.rating}</span>
                                    {seller.seller_profile.is_verified ? (
                                        <span className="badge badge-cyan"><CheckCircle size={12} style={{ marginRight: 4 }} />Verified</span>
                                    ) : (
                                        <button className="badge badge-warning" onClick={() => router.put(`/admin/sellers/${seller.id}/verify`)} style={{ cursor: 'pointer', border: 'none' }}>Verify Seller</button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

        </AdminLayout>
    );
}
