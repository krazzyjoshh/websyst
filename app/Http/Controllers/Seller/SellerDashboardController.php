<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductApproval;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Category;
use App\Models\SellerProfile;
use App\Models\Notification;
use App\Services\ProductApprovalService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SellerDashboardController extends Controller
{
    public function index()
    {
        $sellerId = auth()->id();
        $profile = SellerProfile::where('user_id', $sellerId)->first();

        $monthlyEarnings = OrderItem::where('seller_id', $sellerId)
            ->whereHas('order', function ($q) {
                $q->whereMonth('created_at', now()->month);
            })->sum('total');

        $totalProducts = Product::where('seller_id', $sellerId)->count();
        $totalSold = Product::where('seller_id', $sellerId)->sum('sales_count');

        $recentOrders = OrderItem::where('seller_id', $sellerId)
            ->with('order.user', 'product')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        // Monthly earnings chart
        $monthlyChart = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $earnings = OrderItem::where('seller_id', $sellerId)
                ->whereHas('order', function ($q) use ($date) {
                    $q->whereMonth('created_at', $date->month)
                      ->whereYear('created_at', $date->year);
                })->sum('total');
            $monthlyChart[] = [
                'month' => $date->format('M'),
                'earnings' => (float) $earnings,
            ];
        }

        return Inertia::render('Seller/Dashboard', [
            'profile' => $profile,
            'stats' => [
                'monthlyEarnings' => $monthlyEarnings,
                'totalProducts' => $totalProducts,
                'totalSold' => $totalSold,
            ],
            'recentOrders' => $recentOrders,
            'monthlyChart' => $monthlyChart,
        ]);
    }

    public function products()
    {
        $products = Product::where('seller_id', auth()->id())
            ->with('images', 'category')
            ->orderByDesc('created_at')
            ->paginate(12)
            ->through(function ($p) {
                return array_merge($p->toArray(), ['main_image' => $p->main_image]);
            });

        return Inertia::render('Seller/Products', [
            'products' => $products,
            'categories' => Category::all(),
        ]);
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'stock' => 'required|integer|min:0',
        ]);

        // Create product with pending approval status
        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(5),
            'category_id' => $request->category_id,
            'seller_id' => auth()->id(),
            'price' => $request->price,
            'compare_price' => $request->compare_price,
            'description' => $request->description,
            'stock' => $request->stock,
            'brand' => $request->brand,
            'color' => $request->color,
            'material' => $request->material,
            'is_active' => false, // Products are inactive until approved
            'approval_status' => 'pending',
        ]);

        // Check for flagged keywords
        $approvalService = new ProductApprovalService();
        $flaggedKeywords = $approvalService->checkForFlaggedKeywords($product->name, $product->description);

        // Create product approval record
        $approval = ProductApproval::create([
            'product_id' => $product->id,
            'seller_id' => auth()->id(),
            'status' => 'pending',
            'flagged_keywords' => !empty($flaggedKeywords) ? $flaggedKeywords : null,
        ]);

        // Upload product image if provided
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->images()->create([
                'image_path' => '/storage/' . $path,
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        } elseif ($request->image_url) {
            $product->images()->create([
                'image_path' => $request->image_url,
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        // Send notification to admin about the new product
        $adminUser = \App\Models\User::where('role', 'admin')->first();
        if ($adminUser) {
            $message = "New product added by {$request->user()->name}";
            if (!empty($flaggedKeywords)) {
                $message .= " (Flagged: " . implode(", ", $flaggedKeywords) . ")";
            }
            
            Notification::create([
                'sender_id' => auth()->id(),
                'recipient_id' => $adminUser->id,
                'type' => 'product_pending_approval',
                'title' => 'New Product Pending Approval',
                'message' => $message,
                'action_data' => [
                    'product_id' => $product->id,
                    'approval_id' => $approval->id,
                    'is_flagged' => !empty($flaggedKeywords),
                ],
            ]);
        }

        return back()->with('success', 'Product created! It is pending admin approval.');
    }

    public function updateProduct(Request $request, Product $product)
    {
        if ($product->seller_id !== auth()->id()) abort(403);

        $product->update($request->only([
            'name', 'price', 'compare_price', 'description', 'stock',
            'brand', 'color', 'material', 'is_active', 'category_id',
        ]));

        return back()->with('success', 'Product updated!');
    }

    public function deleteProduct(Product $product)
    {
        if ($product->seller_id !== auth()->id()) abort(403);
        $product->delete();
        return back()->with('success', 'Product deleted!');
    }

    public function orders()
    {
        $orders = OrderItem::where('seller_id', auth()->id())
            ->with('order.user', 'product')
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Seller/Orders', [
            'orders' => $orders,
        ]);
    }

    public function settings()
    {
        $profile = SellerProfile::where('user_id', auth()->id())->first() 
            ?? SellerProfile::create([
                'user_id' => auth()->id(),
                'shop_name' => auth()->user()->name . '\'s Shop',
                'shop_description' => '',
            ]);
        return Inertia::render('Seller/Settings', [
            'profile' => $profile
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'user_name' => 'required|string|max:255',
            'shop_name' => 'required|string|max:255',
            'shop_description' => 'nullable|string',
            'shop_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $profile = SellerProfile::where('user_id', auth()->id())->first() 
            ?? SellerProfile::create([
                'user_id' => auth()->id(),
                'shop_name' => $request->shop_name,
                'shop_description' => $request->shop_description ?? '',
            ]);
        
        $updates = [
            'shop_name' => $request->shop_name,
            'shop_description' => $request->shop_description,
        ];

        if ($request->hasFile('shop_logo')) {
            $path = $request->file('shop_logo')->store('shops', 'public');
            $updates['shop_logo'] = '/storage/' . $path;
        }

        $profile->update($updates);

        if ($request->user_name) {
            auth()->user()->update(['name' => $request->user_name]);
        }

        return back()->with('success', 'Settings updated successfully!');
    }
}
