<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        $featuredProducts = Product::where('is_featured', true)
            ->where('is_active', true)
            ->where('approval_status', 'approved')
            ->with('images', 'category')
            ->orderByDesc('sales_count')
            ->limit(6)
            ->get()
            ->map(function ($p) {
                return array_merge($p->toArray(), ['main_image' => $p->main_image, 'discount_percent' => $p->discount_percent]);
            });

        $dealProducts = Product::where('is_active', true)
            ->where('approval_status', 'approved')
            ->whereNotNull('compare_price')
            ->whereColumn('compare_price', '>', 'price')
            ->with('images', 'category')
            ->orderByRaw('(compare_price - price) / compare_price DESC')
            ->limit(6)
            ->get()
            ->map(function ($p) {
                return array_merge($p->toArray(), ['main_image' => $p->main_image, 'discount_percent' => $p->discount_percent]);
            });

        $trendingProducts = Product::where('is_active', true)
            ->where('approval_status', 'approved')
            ->with('images')
            ->orderByDesc('views')
            ->limit(10)
            ->get()
            ->map(function ($p) {
                return array_merge($p->toArray(), ['main_image' => $p->main_image]);
            });

        $stats = [
            'totalProducts' => Product::where('is_active', true)->where('approval_status', 'approved')->count(),
            'activeSellers' => User::where('role', 'seller')->count(),
            'monthlyRevenue' => Order::where('status', 'delivered')
                ->whereMonth('created_at', now()->month)
                ->sum('total'),
            'happyCustomers' => User::where('role', 'user')->count(),
            'totalOrders' => Order::count(),
        ];

        return Inertia::render('Home', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'dealProducts' => $dealProducts,
            'trendingProducts' => $trendingProducts,
            'stats' => $stats,
        ]);
    }
}
