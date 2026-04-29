<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Show notifications page (Inertia)
     */
    public function index()
    {
        $user = Auth::user();
        
        $notifications = $user->receivedNotifications()
            ->with('sender')
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotifications()->count(),
        ]);
    }

    /**
     * API: Get all notifications as JSON (for NotificationProvider polling)
     */
    public function apiIndex()
    {
        $user = Auth::user();
        
        $notifications = $user->receivedNotifications()
            ->with('sender')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        $unreadCount = $user->unreadNotifications()->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Get unread notifications count for the authenticated user
     */
    public function unreadCount()
    {
        $user = Auth::user();
        $count = $user->unreadNotifications()->count();

        return response()->json(['unread_count' => $count]);
    }

    /**
     * Mark a notification as read (Inertia - redirect back)
     */
    public function markAsRead(Notification $notification)
    {
        if ($notification->recipient_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return back();
    }

    /**
     * API: Mark a notification as read (JSON response for NotificationProvider)
     */
    public function apiMarkAsRead(Notification $notification)
    {
        if ($notification->recipient_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        $user->unreadNotifications()->update(['read_at' => now()]);

        return back();
    }

    /**
     * API: Mark all notifications as read (JSON response)
     */
    public function apiMarkAllAsRead()
    {
        $user = Auth::user();
        $user->unreadNotifications()->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Delete a notification
     */
    public function destroy(Notification $notification)
    {
        if ($notification->recipient_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->delete();

        return back();
    }

    /**
     * API: Delete a notification (JSON response)
     */
    public function apiDelete(Notification $notification)
    {
        if ($notification->recipient_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->delete();

        return response()->json(['message' => 'Notification deleted']);
    }
}
