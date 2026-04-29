import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';
import { NotificationToast } from './Notification';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        // Return a default context instead of throwing (for pages that don't need it)
        return {
            notifications: [],
            unreadCount: 0,
            loading: false,
            markAsRead: () => {},
            markAllAsRead: () => {},
            deleteNotification: () => {},
            fetchNotifications: () => {},
            showToast: () => {},
        };
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [toastNotifications, setToastNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Get CSRF token from meta tag
    const getCsrfToken = () => {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('content') : '';
    };

    const notificationsRef = useRef([]);
    const isFirstLoad = useRef(true);

    // Fetch notifications from server
    const fetchNotifications = useCallback(async () => {
        try {
            const response = await fetch('/api/notifications', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                const data = await response.json();
                const newNotifications = data.notifications || [];
                const currentNotifications = notificationsRef.current;
                // Check for new notifications and show toast
                if (!isFirstLoad.current) {
                    const existingIds = new Set(currentNotifications.map(n => n.id));
                    const newOnes = newNotifications.filter(n => !existingIds.has(n.id));
                    newOnes.forEach(n => showToast(n));
                }
                
                isFirstLoad.current = false;
                notificationsRef.current = newNotifications;
                setNotifications(newNotifications);
                setUnreadCount(data.unread_count || 0);
            }
        } catch (error) {
            // Silently fail
            console.debug('Notifications fetch skipped:', error.message);
        }
    }, []);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(notification =>
                        notification.id === notificationId
                            ? { ...notification, read_at: new Date().toISOString() }
                            : notification
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            const response = await fetch('/api/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(notification => ({
                        ...notification,
                        read_at: notification.read_at || new Date().toISOString()
                    }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    }, []);

    // Delete notification
    const deleteNotification = useCallback(async (notificationId) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                const deletedNotification = notifications.find(n => n.id === notificationId);
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
                if (deletedNotification && !deletedNotification.read_at) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    }, [notifications]);

    // Show toast notification
    const showToast = useCallback((notification) => {
        const toastId = Date.now() + Math.random();
        const toastNotification = {
            ...notification,
            id: toastId,
            created_at: notification.created_at || new Date().toISOString(),
        };

        setToastNotifications(prev => [...prev, toastNotification]);

        setTimeout(() => {
            setToastNotifications(prev => prev.filter(t => t.id !== toastId));
        }, 5500);
    }, []);

    // Close toast notification
    const closeToast = useCallback((toastId) => {
        setToastNotifications(prev => prev.filter(t => t.id !== toastId));
    }, []);

    // Poll for new notifications
    useEffect(() => {
        fetchNotifications();

        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    // Listen for Inertia navigation to refresh notifications
    useEffect(() => {
        const handleNavigate = () => {
            fetchNotifications();
        };

        router.on('navigate', handleNavigate);

        return () => {
            router.off('navigate', handleNavigate);
        };
    }, [fetchNotifications]);

    const value = {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
        showToast,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            {/* Render toast notifications */}
            <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {toastNotifications.map(toast => (
                    <NotificationToast
                        key={toast.id}
                        notification={toast}
                        onClose={closeToast}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};