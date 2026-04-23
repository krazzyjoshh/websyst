<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('is_active', true)
            ->where('approval_status', 'approved')
            ->with('images', 'category');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Price range filter
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Color filter
        if ($request->filled('color')) {
            $query->where('color', 'like', "%{$request->color}%");
        }

        // Brand filter
        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        // Material filter
        if ($request->filled('material')) {
            $query->where('material', 'like', "%{$request->material}%");
        }

        // Sort
        switch ($request->sort) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'bestselling':
                $query->orderBy('sales_count', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->paginate(12)->through(function ($p) {
            return array_merge($p->toArray(), [
                'main_image' => $p->main_image,
                'discount_percent' => $p->discount_percent,
            ]);
        });

        $categories = Category::where('is_active', true)->withCount('products')->get();
        $brands = Product::where('is_active', true)
            ->where('approval_status', 'approved')
            ->whereNotNull('brand')
            ->distinct()
            ->pluck('brand');
        $colors = Product::where('is_active', true)
            ->where('approval_status', 'approved')
            ->whereNotNull('color')
            ->distinct()
            ->pluck('color');

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'colors' => $colors,
            'filters' => $request->only(['search', 'category', 'min_price', 'max_price', 'color', 'brand', 'material', 'sort']),
        ]);
    }

    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->where('approval_status', 'approved')
            ->with(['images', 'category', 'seller', 'reviews.user'])
            ->firstOrFail();

        $product->increment('views');

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->where('approval_status', 'approved')
            ->with('images')
            ->limit(4)
            ->get()
            ->map(function ($p) {
                return array_merge($p->toArray(), ['main_image' => $p->main_image, 'discount_percent' => $p->discount_percent]);
            });

        $productData = array_merge($product->toArray(), [
            'main_image' => $product->main_image,
            'discount_percent' => $product->discount_percent,
            'specifications' => json_decode($product->specifications, true),
        ]);

        return Inertia::render('Products/Show', [
            'product' => $productData,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    public function byCategory($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        return redirect()->route('products.index', ['category' => $category->id]);
    }
}
