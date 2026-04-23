<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMessagingController extends Controller
{
    /**
     * Send a message to a user or seller
     */
    public function sendMessage(Request $request)
    {
        // Verify user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            'action_data' => 'nullable|array',
        ]);

        // Verify recipient exists and is not an admin
        $recipient = User::findOrFail($request->recipient_id);
        if ($recipient->role === 'admin') {
            return response()->json(['message' => 'Cannot send messages to admin users.'], 422);
        }

        $notification = Notification::create([
            'sender_id' => Auth::id(),
            'recipient_id' => $request->recipient_id,
            'type' => 'admin_message',
            'title' => $request->title,
            'message' => $request->message,
            'action_data' => $request->action_data,
        ]);

        return response()->json([
            'message' => 'Message sent successfully',
            'notification' => $notification,
        ]);
    }

    /**
     * Get all messages sent by the admin
     */
    public function sentMessages()
    {
        // Verify user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = Notification::where('sender_id', Auth::id())
            ->with(['recipient', 'sender'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($messages);
    }

    /**
     * Get all unread admin messages for all users
     */
    public function unreadMessages()
    {
        // Verify user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = Notification::where('type', 'admin_message')
            ->whereNull('read_at')
            ->with(['recipient', 'sender'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($messages);
    }

    /**
     * Get message statistics
     */
    public function messageStats()
    {
        // Verify user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $stats = [
            'total_sent' => Notification::where('sender_id', Auth::id())->count(),
            'total_unread' => Notification::where('type', 'admin_message')
                ->whereNull('read_at')
                ->count(),
        ];

        return response()->json($stats);
    }
}
