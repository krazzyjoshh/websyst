import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import { Check, ArrowLeft } from 'lucide-react';
import '../Cart.scss';

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderShow({ order }) {
    const currentStep = statuses.indexOf(order.status);

    return (
        <Layout>
            <Head title={`Order ${order.order_number}`} />
            <div className="orders-page">
                <div className="container">
                    <Link href="/orders" className="btn-ghost" style={{ marginBottom: 24, display: 'inline-flex' }}>
                        <ArrowLeft size={16} /> Back to Orders
                    </Link>

                    <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700 }}>
                                    Order {order.order_number}
                                </h1>
                                <p style={{ fontSize: 14, color: '#A3A3A3', marginTop: 4 }}>
                                    Placed on {new Date(order.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <span className={`badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'cancelled' ? 'badge-danger' : 'badge-cyan'}`}>
                                {order.status}
                            </span>
                        </div>

                        {/* Status Timeline */}
                        {order.status !== 'cancelled' && (
                            <div className="status-timeline">
                                {statuses.map((status, i) => (
                                    <React.Fragment key={status}>
                                        <div className={`status-step ${i <= currentStep ? 'status-step--completed' : ''} ${i === currentStep ? 'status-step--active' : ''}`}>
                                            <div className="status-step__dot">
                                                {i <= currentStep ? <Check size={14} /> : i + 1}
                                            </div>
                                            <span className="status-step__label">{status}</span>
                                        </div>
                                        {i < statuses.length - 1 && <div className={`status-step__line ${i < currentStep ? 'status-step--completed' : ''}`} style={{ background: i < currentStep ? '#00F0FF' : undefined }} />}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* Items */}
                        <div className="glass-card" style={{ padding: 28 }}>
                            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, marginBottom: 20 }}>Order Items</h3>
                            {order.items?.map((item) => (
                                <div key={item.id} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', background: '#1A1A1A', flexShrink: 0 }}>
                                        {item.product?.images?.[0] && <img src={item.product.images[0].image_path} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.product_name}</p>
                                        <p style={{ fontSize: 12, color: '#666' }}>Qty: {item.quantity} × ₱{parseFloat(item.product_price).toLocaleString()}</p>
                                    </div>
                                    <span style={{ fontWeight: 700, color: '#00F0FF' }}>₱{parseFloat(item.total).toLocaleString()}</span>
                                </div>
                            ))}
                            <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#A3A3A3', marginBottom: 8 }}>
                                    <span>Subtotal</span><span>₱{parseFloat(order.subtotal).toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#A3A3A3', marginBottom: 8 }}>
                                    <span>Delivery Fee</span><span>{parseFloat(order.shipping_fee) === 0 ? 'FREE' : `₱${parseFloat(order.shipping_fee).toLocaleString()}`}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 700, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <span>Total</span><span style={{ color: '#00F0FF', fontFamily: 'Space Grotesk' }}>₱{parseFloat(order.total).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="glass-card" style={{ padding: 28 }}>
                            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, marginBottom: 20 }}>Delivery Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    ['Name', order.customer_name],
                                    ['Email', order.customer_email],
                                    ['Phone', order.customer_phone],
                                    ['Address', order.shipping_address],
                                    ['City', order.city],
                                    ['Province', order.province],
                                    ['Payment', order.payment_method?.toUpperCase()],
                                ].map(([label, value]) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 10 }}>
                                        <span style={{ fontSize: 13, color: '#666' }}>{label}</span>
                                        <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
