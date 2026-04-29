import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, User, Menu, X, Search, ChevronDown, LogOut, Package, Settings, LayoutDashboard, Bell } from 'lucide-react';
import { useNotifications } from './NotificationProvider';
import { NotificationDropdown } from './Notification';
import './Layout.scss';

export default function Layout({ children }) {
    const { auth, cartCount } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClick = () => {
            setUserDropdownOpen(false);
            setNotificationDropdownOpen(false);
        };
        if (userDropdownOpen || notificationDropdownOpen) {
            setTimeout(() => document.addEventListener('click', handleClick), 0);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [userDropdownOpen, notificationDropdownOpen]);

    return (
        <div className="layout">
            {/* ═══ NAVBAR ═══ */}
            <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
                <div className="navbar__inner container">
                    <Link href="/" className="navbar__logo">
                        <span className="navbar__logo-text">SHOP</span>
                        <span className="navbar__logo-accent">HUB</span>
                    </Link>

                    <div className={`navbar__links ${mobileMenuOpen ? 'navbar__links--open' : ''}`}>
                        <Link href="/" className="navbar__link">Home</Link>
                        <Link href="/products" className="navbar__link">Products</Link>
                        <Link href="/products?sort=bestselling" className="navbar__link">Deals</Link>
                        <Link href="/products" className="navbar__link">Categories</Link>
                    </div>

                    <div className="navbar__actions">
                        <Link href="/products" className="navbar__search-btn">
                            <Search size={18} />
                        </Link>

                        {auth?.user ? (
                            <>
                                <Link href="/cart" className="navbar__cart-btn">
                                    <ShoppingCart size={18} />
                                    {cartCount > 0 && (
                                        <span className="navbar__cart-badge">{cartCount}</span>
                                    )}
                                </Link>

                                {/* Notifications */}
                                <div className="navbar__notification-menu" style={{ position: 'relative' }}>
                                    <button
                                        className="navbar__notification-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setNotificationDropdownOpen(!notificationDropdownOpen);
                                            setUserDropdownOpen(false);
                                        }}
                                        style={{ position: 'relative' }}
                                    >
                                        <Bell size={18} />
                                        {unreadCount > 0 && (
                                            <span className="navbar__notification-badge">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {notificationDropdownOpen && (
                                        <NotificationDropdown
                                            notifications={notifications}
                                            onMarkAsRead={markAsRead}
                                            onMarkAllAsRead={markAllAsRead}
                                            onClose={deleteNotification}
                                            onViewAll={() => {
                                                setNotificationDropdownOpen(false);
                                                window.location.href = '/notifications';
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="navbar__user-menu" style={{ position: 'relative' }}>
                                    <button
                                        className="navbar__user-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setUserDropdownOpen(!userDropdownOpen);
                                            setNotificationDropdownOpen(false);
                                        }}
                                    >
                                        <div className="navbar__avatar" style={{ overflow: 'hidden', padding: 0 }}>
                                            {auth.user.avatar ? (
                                                <img src={auth.user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                            ) : (
                                                <span>{auth.user.name.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <ChevronDown size={14} />
                                    </button>

                                    {userDropdownOpen && (
                                        <div className="navbar__dropdown">
                                            <div className="navbar__dropdown-header">
                                                <p className="navbar__dropdown-name">{auth.user.name}</p>
                                                <p className="navbar__dropdown-email">{auth.user.email}</p>
                                            </div>
                                            <div className="navbar__dropdown-divider" />

                                            {auth.user.role === 'admin' && (
                                                <Link href="/admin/dashboard" className="navbar__dropdown-item">
                                                    <LayoutDashboard size={16} /> Admin Panel
                                                </Link>
                                            )}

                                            <Link href="/notifications" className="navbar__dropdown-item">
                                                <Bell size={16} /> Notifications
                                            </Link>

                                            <Link href="/profile" className="navbar__dropdown-item">
                                                <User size={16} /> My Profile
                                            </Link>
                                            <Link href="/orders" className="navbar__dropdown-item">
                                                <Package size={16} /> My Orders
                                            </Link>
                                            <div className="navbar__dropdown-divider" />
                                            <Link href="/logout" method="post" as="button" className="navbar__dropdown-item navbar__dropdown-item--danger">
                                                <LogOut size={16} /> Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="navbar__auth-buttons">
                                <Link href="/login" className="btn-outline btn-sm">Login</Link>
                                <Link href="/register" className="btn-primary btn-sm navbar__register-btn">Register</Link>
                            </div>
                        )}

                        <button className="navbar__mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ═══ MAIN ═══ */}
            <main className="main-content">
                {children}
            </main>

            {/* ═══ FOOTER ═══ */}
            <footer className="footer">
                <div className="footer__glow" />
                <div className="container">
                    <div className="footer__grid">
                        <div className="footer__col">
                            <div className="footer__brand">
                                <span className="footer__logo-text">SHOP</span>
                                <span className="footer__logo-accent">HUB</span>
                            </div>
                            <p className="footer__desc">
                                Discover the perfect harmony of quality and value. Your premium e-commerce destination in the Philippines.
                            </p>
                            <div className="footer__payment-icons">
                                <span className="footer__payment-badge">GCash</span>
                                <span className="footer__payment-badge">Maya</span>
                                <span className="footer__payment-badge">COD</span>
                            </div>
                        </div>

                        <div className="footer__col">
                            <h4 className="footer__heading">Categories</h4>
                            <Link href="/products?category=4" className="footer__link">Electronics</Link>
                            <Link href="/products?category=5" className="footer__link">Apparel</Link>
                            <Link href="/products?category=6" className="footer__link">Shoes</Link>
                            <Link href="/products?category=1" className="footer__link">Furniture</Link>
                            <Link href="/products?category=2" className="footer__link">Bags</Link>
                            <Link href="/products?category=3" className="footer__link">Books</Link>
                        </div>

                        <div className="footer__col">
                            <h4 className="footer__heading">Support</h4>
                            <a href="#" className="footer__link">Help Center</a>
                            <a href="#" className="footer__link">Shipping Info</a>
                            <a href="#" className="footer__link">Returns</a>
                            <a href="#" className="footer__link">Track Order</a>
                            <a href="#" className="footer__link">Contact Us</a>
                        </div>

                        <div className="footer__col">
                            <h4 className="footer__heading">Newsletter</h4>
                            <p className="footer__desc">Get exclusive deals & updates</p>
                            <div className="footer__newsletter">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="footer__newsletter-input"
                                />
                                <button className="footer__newsletter-btn">→</button>
                            </div>
                        </div>
                    </div>

                    <div className="footer__bottom">
                        <div className="footer__bottom-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
