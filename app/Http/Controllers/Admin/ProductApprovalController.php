<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductApproval;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductApprovalController extends Controller
{
    /**
     * Show the product approvals page (Inertia)
     */
    public function index()
    {
        // Verify user is admin
        if (\Illuminate\Support\Facades\Auth::user()->role !== 'admin') {
            return redirect('/');
        }

        $pendingProducts = ProductApproval::where('status', 'pending')
            ->with(['product.category', 'product.images', 'seller'])
            ->orderByDesc('created_at')
            ->get();

        $approvedProducts = ProductApproval::where('status', 'approved')
            ->with(['product.category', 'product.images', 'seller'])
            ->orderByDesc('created_at')
            ->get();

        $rejectedProducts = ProductApproval::where('status', 'rejected')
            ->with(['product.category', 'product.images', 'seller'])
            ->orderByDesc('created_at')
            ->get();

        return \Inertia\Inertia::render('Admin/ProductApprovals', [
            'pendingProducts' => $pendingProducts,
            'approvedProducts' => $approvedProducts,
            'rejectedProducts' => $rejectedProducts,
        ]);
    }
    /**
     * Get all pending product approvals
     */
    public function pendingApprovals()
    {
        // Verify user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $approvals = ProductApproval::where('status', 'pending')
            ->with(['product', 'seller'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($approvals);
    }

    /**
     * Get all product approvals (all statuses)
     */
    public function allApprovals()
    {
        // Verify user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $approvals = ProductApproval::with(['product', 'seller', 'reviewer'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($approvals);
    }

    /**
     * Get products with flagged keywords
     */
    public function flaggedProducts()
    {
        // Verify user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $approvals = ProductApproval::where('status', 'pending')
            ->whereNotNull('flagged_keywords')
            ->with(['product', 'seller'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($approvals);
    }

    /**
     * Approve a product
     */
    public function approve(Request $request, ProductApproval $approval)
    {
        // Verify user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($approval->status !== 'pending') {
            return response()->json(['message' => 'This product has already been reviewed.'], 422);
        }

        $approval->approve(Auth::id());

        // Send notification to seller
        Notification::create([
            'sender_id' => Auth::id(),
            'recipient_id' => $approval->seller_id,
            'type' => 'product_approved',
            'title' => 'Product Approved',
            'message' => "Your product '{$approval->product->name}' has been approved and is now live on the platform.",
            'action_data' => [
                'product_id' => $approval->product_id,
                'link' => route('products.show', $approval->product->slug),
            ],
        ]);

        return redirect()->back()->with('success', 'Product approved successfully');
    }

    /**
     * Reject a product
     */
    public function reject(Request $request, ProductApproval $approval)
    {
        // Verify user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        if ($approval->status !== 'pending') {
            return response()->json(['message' => 'This product has already been reviewed.'], 422);
        }

        $approval->reject(Auth::id(), $request->rejection_reason);

        // Send notification to seller
        Notification::create([
            'sender_id' => Auth::id(),
            'recipient_id' => $approval->seller_id,
            'type' => 'product_rejected',
            'title' => 'Product Rejected',
            'message' => "Your product '{$approval->product->name}' has been rejected.\n\nReason: {$request->rejection_reason}",
            'action_data' => [
                'product_id' => $approval->product_id,
                'reason' => $request->rejection_reason,
            ],
        ]);

        return redirect()->back()->with('success', 'Product rejected successfully');
    }

    /**
     * Get approval statistics
     */
    public function stats()
    {
        // Verify user is admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $stats = [
            'total_pending' => ProductApproval::where('status', 'pending')->count(),
            'total_approved' => ProductApproval::where('status', 'approved')->count(),
            'total_rejected' => ProductApproval::where('status', 'rejected')->count(),
            'flagged_count' => ProductApproval::where('status', 'pending')
                ->whereNotNull('flagged_keywords')
                ->count(),
        ];

        return response()->json($stats);
    }
}
