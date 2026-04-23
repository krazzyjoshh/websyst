import React, { useState, useEffect, useRef } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import Layout from '../Components/Layout';
import { ArrowRight, TrendingUp, Star, Truck, Shield, Headphones, BadgeCheck, Eye, ShoppingBag, Zap } from 'lucide-react';
import './Home.scss';

// Animated counter hook
function useCounter(end, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    let start = 0;
                    const step = end / (duration / 16);
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return [count, ref];
}

function StatCard({ label, value, suffix = '', prefix = '', trend, icon: Icon }) {
    const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
    const [count, ref] = useCounter(numericValue);

    return (
        <div className="stat-card glass-card" ref={ref}>
            <div className="stat-card__icon">
                <Icon size={20} />
            </div>
            <div className="stat-card__value">
                {prefix}{typeof value === 'number' && value > 999
                    ? count.toLocaleString()
                    : count.toLocaleString()
                }{suffix}
            </div>
            <div className="stat-card__label">{label}</div>
            {trend && (
                <div className="stat-card__trend">
                    <TrendingUp size={14} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
    );
}

function CategoryCard({ category }) {
    return (
        <Link href={`/products?category=${category.id}`} className="category-card glass-card">
            <div className="category-card__image">
                <img src={category.image} alt={category.name} loading="lazy" />
                <div className="category-card__overlay" />
            </div>
            <div className="category-card__content">
                <h3 className="category-card__name">{category.name}</h3>
                <p className="category-card__count">{category.products_count} Products</p>
            </div>
        </Link>
    );
}

function ProductCard({ product, rank }) {
    const addToCart = (e) => {
        e.preventDefault();
        router.post('/cart/add', { product_id: product.id, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <Link href={`/products/${product.slug}`} className="product-card glass-card">
            {rank && <div className="product-card__rank">#{rank}</div>}
            {product.discount_percent > 0 && (
                <div className="product-card__discount">-{product.discount_percent}%</div>
            )}
            <div className="product-card__image">
                <img src={product.main_image || product.images?.[0]?.image_path} alt={product.name} loading="lazy" />
            </div>
            <div className="product-card__content">
                <p className="product-card__category">{product.category?.name}</p>
                <h3 className="product-card__name">{product.name}</h3>
                <div className="product-card__meta">
                    <div className="product-card__rating">
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span>{product.rating}</span>
                    </div>
                    <span className="product-card__sales">{product.sales_count} sold</span>
                </div>
                <div className="product-card__pricing" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <div>
                        <span className="product-card__price" style={{ display: 'block' }}>₱{parseFloat(product.price).toLocaleString()}</span>
                        {product.compare_price && (
                            <span className="product-card__compare">₱{parseFloat(product.compare_price).toLocaleString()}</span>
                        )}
                    </div>
                    <button onClick={addToCart} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}>
                        <ShoppingBag size={14} /> Buy
                    </button>
                </div>
            </div>
        </Link>
    );
}

function LiveFeedItem({ product, index }) {
    const cities = ['Manila', 'Cebu', 'Davao', 'Quezon City', 'Makati', 'Taguig', 'Pasig'];
    const city = cities[index % cities.length];
    const minutes = Math.floor(Math.random() * 30) + 1;

    return (
        <div className="live-feed__item" style={{ animationDelay: `${index * 0.15}s` }}>
            <div className="live-feed__dot" />
            <div className="live-feed__text">
                <span className="live-feed__action">Someone in <strong>{city}</strong> purchased</span>
                <span className="live-feed__product">{product.name}</span>
            </div>
            <span className="live-feed__time">{minutes}m ago</span>
        </div>
    );
}

export default function Home({ categories, featuredProducts, dealProducts, trendingProducts, stats }) {
    const [typedText, setTypedText] = useState('');
    const fullText = 'ASCEND BEYOND LIMITS';

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setTypedText(fullText.slice(0, i + 1));
            i++;
            if (i >= fullText.length) clearInterval(timer);
        }, 60);
        return () => clearInterval(timer);
    }, []);

    return (
        <Layout>
            <Head title="Home" />

            {/* ═══ HERO SECTION ═══ */}
            <section className="hero">
                <div className="hero__bg">
                    <div className="hero__orb hero__orb--1" />
                    <div className="hero__orb hero__orb--2" />
                    <div className="hero__orb hero__orb--3" />
                </div>

                <div className="hero__content container">
                    <div className="hero__badge" style={{ display: 'none' }}>
                    </div>

                    <h1 className="hero__title" style={{ background: 'none', color: '#000000', WebkitBackgroundClip: 'unset', WebkitTextFillColor: 'unset' }}>
                        {typedText}
                        <span className="hero__cursor" style={{ color: '#8B5CF6' }}>|</span>
                    </h1>

                    <p className="hero__subtitle">
                        with intelligent e-commerce infrastructure
                    </p>

                    <p className="hero__description">
                        Discover the perfect harmony of quality and value — delivering the best
                        products with predictive analytics and seamless shopping experience.
                    </p>

                    <div className="hero__actions">
                        <Link href="/products" className="btn-primary hero__cta">
                            Explore Collections
                            <ArrowRight size={18} />
                        </Link>
                        <Link href="/products?sort=bestselling" className="btn-outline">
                            View Deals
                        </Link>
                    </div>
                </div>

                {/* Dashboard Preview Removed */}
            </section>

            {/* ═══ STATS SECTION ═══ */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <StatCard
                            label="Total Products"
                            value={stats.totalProducts || 0}
                            suffix="+"
                            trend="+12.5% this month"
                            icon={ShoppingBag}
                        />
                        <StatCard
                            label="Active Sellers"
                            value={stats.activeSellers || 0}
                            trend="Verified partners"
                            icon={BadgeCheck}
                        />
                        <StatCard
                            label="Monthly Revenue"
                            value={Math.floor((stats.monthlyRevenue || 0) / 1000)}
                            prefix="₱"
                            suffix="K"
                            trend="+18.2% growth"
                            icon={TrendingUp}
                        />
                        <StatCard
                            label="Happy Customers"
                            value={stats.happyCustomers || 0}
                            suffix="+"
                            trend="98.5% satisfaction"
                            icon={Star}
                        />
                    </div>
                </div>
            </section>

            {/* ═══ TOP CATEGORIES ═══ */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">
                                SHOP OUR TOP <span className="gradient-text">CATEGORIES</span>
                            </h2>
                            <p className="section-subtitle">
                                Browse curated collections designed for your lifestyle
                            </p>
                        </div>
                        <Link href="/products" className="btn-outline">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="categories-grid">
                        {categories.map((cat) => (
                            <CategoryCard key={cat.id} category={cat} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ LIVE TRENDING ═══ */}
            <section className="live-section">
                <div className="container">
                    <div className="live-section__grid">
                        <div className="live-feed glass-card">
                            <div className="live-feed__header">
                                <div className="live-feed__indicator" />
                                <h3>Real-time Inference Log</h3>
                            </div>
                            <div className="live-feed__list">
                                {trendingProducts.slice(0, 6).map((product, i) => (
                                    <LiveFeedItem key={product.id} product={product} index={i} />
                                ))}
                            </div>
                        </div>

                        <div className="trending-chart glass-card">
                            <h3 className="trending-chart__title">Predictive Trajectory</h3>
                            <div className="trending-chart__bars">
                                {trendingProducts.slice(0, 5).map((product, i) => (
                                    <div key={product.id} className="trending-chart__bar-row">
                                        <span className="trending-chart__bar-label">{product.name.substring(0, 18)}...</span>
                                        <div className="trending-chart__bar-track">
                                            <div
                                                className="trending-chart__bar-fill"
                                                style={{
                                                    width: `${(product.views / (trendingProducts[0]?.views || 1)) * 100}%`,
                                                    animationDelay: `${i * 0.1}s`
                                                }}
                                            />
                                        </div>
                                        <span className="trending-chart__bar-value">{(product.views / 1000).toFixed(1)}K</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ DEALS & OFFERS ═══ */}
            {dealProducts.length > 0 && (
                <section className="deals-section">
                    <div className="container">
                        <div className="section-header">
                            <div>
                                <h2 className="section-title">
                                    HOT <span className="gradient-text">DEALS</span> & OFFERS
                                </h2>
                                <p className="section-subtitle">
                                    Limited time offers — save big on premium products
                                </p>
                            </div>
                            <Link href="/products?sort=bestselling" className="btn-outline">
                                All Deals <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="products-grid">
                            {dealProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ FEATURED PRODUCTS ═══ */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">
                                FEATURED <span className="gradient-text">BESTSELLERS</span>
                            </h2>
                            <p className="section-subtitle">
                                Top-ranking products loved by our customers
                            </p>
                        </div>
                    </div>

                    <div className="products-grid">
                        {featuredProducts.map((product, i) => (
                            <ProductCard key={product.id} product={product} rank={i + 1} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ WHY SHOP WITH US ═══ */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>
                        WHY SHOP WITH <span className="gradient-text">US</span>
                    </h2>

                    <div className="features-grid">
                        {[
                            { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over ₱5,000. Express delivery available nationwide.' },
                            { icon: Shield, title: 'Secure Payments', desc: 'Pay safely with GCash, Maya, or Cash on Delivery. 100% buyer protection.' },
                            { icon: Headphones, title: '24/7 Support', desc: 'Our team is here to help anytime. Chat, call, or email us.' },
                            { icon: BadgeCheck, title: 'Best Price Guarantee', desc: 'Found a lower price? We\'ll match it. Quality products at the best value.' },
                        ].map((feature, i) => (
                            <div key={i} className="feature-card glass-card">
                                <div className="feature-card__icon">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="feature-card__title">{feature.title}</h3>
                                <p className="feature-card__desc">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
