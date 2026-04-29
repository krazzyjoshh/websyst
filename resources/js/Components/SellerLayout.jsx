import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, ShoppingCart, ChevronRight, LogOut, User, Settings, Bell } from 'lucide-react';
import { useNotifications } from './NotificationProvider';
import { NotificationDropdown } from './Notification';
import '../Pages/Admin/Admin.scss';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/seller/dashboard' },
    { icon: Package, label: 'My Products', href: '/admin/seller/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/seller/orders' },
    { icon: Settings, label: 'Settings', href: '/admin/seller/settings' },
];

export default function SellerLayout({ children, title }) {
    const page = usePage();
    const { url } = page;
    const { auth, sellerProfile } = page.props;
    const user = auth?.user;
    const shopLogo = sellerProfile?.shop_logo;
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    useEffect(() => {
        const handleClick = () => setNotificationDropdownOpen(false);
        if (notificationDropdownOpen) {
            setTimeout(() => document.addEventListener('click', handleClick), 0);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [notificationDropdownOpen]);

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar__header" style={{ justifyContent: 'center' }}>
                    <Link href="/" className="admin-sidebar__logo">
                        <span className="admin-sidebar__logo-text">SHOP</span>
                        <span className="admin-sidebar__logo-accent">HUB</span>
                    </Link>
                </div>

                {/* Profile in sidebar */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}>
                    {shopLogo ? (
                        <img src={shopLogo} alt="Shop Logo" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)' }} />
                    ) : user?.avatar ? (
                        <img src={user.avatar} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)' }} />
                    ) : (
                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#FFF', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)' }}>
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                    )}
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                        <p style={{ fontSize: 12, color: '#8B5CF6', margin: '4px 0 0 0', fontWeight: 600 }}>Seller Account</p>
                    </div>
                </div>

                <nav className="admin-sidebar__nav">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href} className={`admin-sidebar__item ${url.startsWith(item.href) ? 'admin-sidebar__item--active' : ''}`}>
                            <item.icon size={18} /><span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="admin-sidebar__footer">
                    <div className="navbar__notification-menu" style={{ position: 'relative' }}>
                        <button
                            className="admin-sidebar__item"
                            onClick={(e) => {
                                e.stopPropagation();
                                setNotificationDropdownOpen(!notificationDropdownOpen);
                            }}
                            style={{ position: 'relative', justifyContent: 'flex-start' }}
                        >
                            <Bell size={18} />
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: '#EF4444',
                                    color: '#FFFFFF',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
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
                                position="sidebar"
                                onViewAll={() => {
                                    setNotificationDropdownOpen(false);
                                    window.location.href = '/notifications';
                                }}
                            />
                        )}
                    </div>
                    <Link href="/logout" method="post" as="button" className="admin-sidebar__item admin-sidebar__item--danger"><LogOut size={18} /> <span>Logout</span></Link>
                </div>
            </aside>
            <main className="admin-main">
                <div className="admin-main__header">
                    <h1 className="admin-main__title">{title}</h1>
                </div>
                <div className="admin-main__content">{children}</div>
            </main>
        </div>
    );
}
