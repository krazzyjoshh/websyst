import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { NotificationToast } from './Notification';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [toastNotifications, setToastNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch notifications from server
    const fetchNotifications = useCallback(async () => {
        try {
            const response = await fetch('/api/notifications', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unread_count || 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
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
                },
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
                },
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
                },
            });

            if (response.ok) {
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
                // Update unread count if deleted notification was unread
                const deletedNotification = notifications.find(n => n.id === notificationId);
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
            created_at: new Date().toISOString(),
        };

        setToastNotifications(prev => [...prev, toastNotification]);

        // Auto-remove toast after animation
        setTimeout(() => {
            setToastNotifications(prev => prev.filter(t => t.id !== toastId));
        }, 5500); // Slightly longer than the auto-close duration
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
    }, [fetchNotifications]);

    // Listen for real-time notifications (if using WebSockets or Server-Sent Events)
    useEffect(() => {
        const handleNewNotification = (event) => {
            const newNotification = JSON.parse(event.data);
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            showToast(newNotification);
        };

        // For now, we'll use polling. In production, you might want to implement WebSockets
        // window.addEventListener('notification', handleNewNotification);

        return () => {
            // window.removeEventListener('notification', handleNewNotification);
        };
    }, [showToast]);

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
            {toastNotifications.map(toast => (
                <NotificationToast
                    key={toast.id}
                    notification={toast}
                    onClose={closeToast}
                />
            ))}
        </NotificationContext.Provider>
    );
};