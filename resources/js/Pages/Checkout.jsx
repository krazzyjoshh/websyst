import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Layout from '../Components/Layout';
import { CreditCard, MapPin, ArrowRight } from 'lucide-react';
import './Cart.scss';

export default function Checkout({ cartItems, subtotal, shippingFee, total, user }) {
    const [form, setForm] = useState({
        customer_name: user?.name || '',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '',
        shipping_address: user?.address || '',
        city: user?.city || '',
        province: user?.province || '',
        zip_code: user?.zip_code || '',
        payment_method: 'cod',
        notes: '',
    });
    const [processing, setProcessing] = useState(false);

    const update = (key, value) => setForm({ ...form, [key]: value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/checkout', form, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <Layout>
            <Head title="Checkout" />
            <div className="checkout-page">
                <div className="container">
                    <h1 className="section-title">
                        <span className="gradient-text">CHECKOUT</span>
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="checkout-layout">
                            <div className="checkout-form glass-card" style={{ padding: 32 }}>
                                {/* Delivery Info */}
                                <div className="checkout-form__section">
                                    <h3><MapPin size={18} style={{ display: 'inline', marginRight: 8 }} />Delivery Information</h3>
                                    <div className="checkout-form__grid">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input className="form-input" value={form.customer_name} onChange={(e) => update('customer_name', e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" className="form-input" value={form.customer_email} onChange={(e) => update('customer_email', e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone</label>
                                            <input className="form-input" value={form.customer_phone} onChange={(e) => update('customer_phone', e.target.value)} required placeholder="09XX XXX XXXX" />
                                        </div>
                                        <div className="form-group">
                                            <label>Zip Code</label>
                                            <input className="form-input" value={form.zip_code} onChange={(e) => update('zip_code', e.target.value)} required />
                                        </div>
                                        <div className="form-group checkout-form__full">
                                            <label>Delivery Address</label>
                                            <textarea className="form-input" rows="3" value={form.shipping_address} onChange={(e) => update('shipping_address', e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>City</label>
                                            <input className="form-input" value={form.city} onChange={(e) => update('city', e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Province</label>
                                            <input className="form-input" value={form.province} onChange={(e) => update('province', e.target.value)} required />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="checkout-form__section">
                                    <h3><CreditCard size={18} style={{ display: 'inline', marginRight: 8 }} />Payment Method</h3>
                                    <div className="payment-methods">
                                        {[
                                            { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when delivered' },
                                            { id: 'gcash', name: 'GCash', desc: 'Mobile payment' },
                                            { id: 'maya', name: 'Maya', desc: 'Digital wallet' },
                                        ].map((pm) => (
                                            <div
                                                key={pm.id}
                                                className={`payment-method ${form.payment_method === pm.id ? 'payment-method--active' : ''}`}
                                                onClick={() => update('payment_method', pm.id)}
                                            >
                                                <p className="payment-method__name">{pm.name}</p>
                                                <p className="payment-method__desc">{pm.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="checkout-form__section">
                                    <div className="form-group">
                                        <label>Order Notes (Optional)</label>
                                        <textarea className="form-input" rows="2" placeholder="Special instructions..." value={form.notes} onChange={(e) => update('notes', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="checkout-summary glass-card" style={{ padding: 28 }}>
                                <h3 className="cart-summary__title">Order Summary</h3>
                                <div className="checkout-summary__items">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="checkout-summary__item">
                                            <div className="checkout-summary__item-img">
                                                <img src={item.product.main_image || item.product.images?.[0]?.image_path} alt="" />
                                            </div>
                                            <div className="checkout-summary__item-info">
                                                <p>{item.product.name}</p>
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                            <div className="checkout-summary__item-price">
                                                ₱{item.subtotal.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="cart-summary__row">
                                    <span>Subtotal</span><span>₱{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="cart-summary__row">
                                    <span>Delivery Fee</span><span>{shippingFee === 0 ? <span style={{ color: '#10B981' }}>FREE</span> : `₱${shippingFee}`}</span>
                                </div>
                                <div className="cart-summary__divider" />
                                <div className="cart-summary__row cart-summary__row--total">
                                    <span>Total</span><span>₱{total.toLocaleString()}</span>
                                </div>
                                <button type="submit" className="btn-primary cart-summary__checkout" disabled={processing}>
                                    {processing ? 'Placing Order...' : 'Place Order'}
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
