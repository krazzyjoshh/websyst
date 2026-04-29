<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminMessagingController extends Controller
{
    /**
     * Show the messaging page (Inertia)
     */
    public function index()
    {
        $users = User::where('role', '!=', 'admin')
            ->select('id', 'name', 'email', 'role', 'avatar')
            ->orderBy('name')
            ->get();

        $recentMessages = Notification::where('sender_id', Auth::id())
            ->with('recipient')
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return Inertia::render('Admin/Messaging', [
            'users' => $users,
            'recentMessages' => $recentMessages,
        ]);
    }

    /**
     * Send a message to one or more users/sellers
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'recipient_ids' => 'required|array|min:1',
            'recipient_ids.*' => 'exists:users,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            'type' => 'nullable|string|in:message,warning,info,success',
        ]);

        $type = $request->type ?: 'message';
        $count = 0;

        foreach ($request->recipient_ids as $recipientId) {
            $recipient = User::find($recipientId);
            if ($recipient && $recipient->role !== 'admin') {
                Notification::create([
                    'sender_id' => Auth::id(),
                    'recipient_id' => $recipientId,
                    'type' => $type,
                    'title' => $request->title,
                    'message' => $request->message,
                ]);
                $count++;
            }
        }

        return back()->with('success', "Message sent to {$count} recipient(s)!");
    }

    /**
     * Send a message to all users and sellers
     */
    public function sendToAll(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            'type' => 'nullable|string|in:message,warning,info,success',
        ]);

        $type = $request->type ?: 'message';
        
        $users = User::where('role', '!=', 'admin')->get();
        $count = 0;

        foreach ($users as $user) {
            Notification::create([
                'sender_id' => Auth::id(),
                'recipient_id' => $user->id,
                'type' => $type,
                'title' => $request->title,
                'message' => $request->message,
            ]);
            $count++;
        }

        return back()->with('success', "Message sent to all {$count} users!");
    }

    /**
     * Get all messages sent by the admin
     */
    public function sentMessages()
    {
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
        $messages = Notification::where('type', 'message')
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
        $stats = [
            'total_sent' => Notification::where('sender_id', Auth::id())->count(),
            'total_unread' => Notification::whereIn('type', ['message', 'warning', 'info'])
                ->whereNull('read_at')
                ->count(),
        ];

        return response()->json($stats);
    }
}
