<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminCrudController extends Controller
{
    // ─── USERS ───
    public function users(Request $request)
    {
        $query = User::query();
        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        }
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        return Inertia::render('Admin/Users', [
            'users' => $query->orderByDesc('created_at')->paginate(15),
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:user,seller,admin',
        ]);
        $user->update($request->only('name', 'email', 'role'));
        return back()->with('success', 'User updated!');
    }

    public function deleteUser(User $user)
    {
        if ($user->role === 'admin') {
            return back()->with('error', 'Cannot delete admin users.');
        }
        $user->delete();
        return back()->with('success', 'User deleted!');
    }

    // ─── PRODUCTS ───
    public function products(Request $request)
    {
        $query = Product::with('category', 'images');
        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        $products = $query->orderByDesc('created_at')->paginate(15)->through(function ($p) {
            return array_merge($p->toArray(), ['main_image' => $p->main_image]);
        });

        return Inertia::render('Admin/Products', [
            'products' => $products,
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category']),
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
            'image_url' => 'nullable|url',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(5),
            'category_id' => $request->category_id,
            'price' => $request->price,
            'compare_price' => $request->compare_price,
            'description' => $request->description,
            'stock' => $request->stock,
            'brand' => $request->brand,
            'color' => $request->color,
            'material' => $request->material,
            'is_featured' => $request->boolean('is_featured'),
            'is_active' => true,
        ]);

        if ($request->image_url) {
            $product->images()->create([
                'image_path' => $request->image_url,
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        return back()->with('success', 'Product created!');
    }

    public function updateProduct(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        $product->update($request->only([
            'name', 'price', 'compare_price', 'description', 'stock',
            'brand', 'color', 'material', 'is_featured', 'is_active', 'category_id',
        ]));

        return back()->with('success', 'Product updated!');
    }

    public function deleteProduct(Product $product)
    {
        $product->delete();
        return back()->with('success', 'Product deleted!');
    }

    // ─── CATEGORIES ───
    public function categories()
    {
        return Inertia::render('Admin/Categories', [
            'categories' => Category::withCount('products')->orderBy('sort_order')->get(),
        ]);
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $imagePath = '/storage/' . $path;
        }

        Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(4),
            'description' => $request->description,
            'image' => $imagePath,
            'icon' => $request->icon,
        ]);

        return back()->with('success', 'Category created!');
    }

    public function updateCategory(Request $request, Category $category)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $category->update($request->only('name', 'description', 'image', 'icon', 'is_active'));
        return back()->with('success', 'Category updated!');
    }

    public function deleteCategory(Category $category)
    {
        if ($category->products()->count() > 0) {
            return back()->with('error', 'Cannot delete category with products.');
        }
        $category->delete();
        return back()->with('success', 'Category deleted!');
    }

    // ─── ORDERS ───
    public function orders(Request $request)
    {
        $query = Order::with('user', 'items');
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $query->where('order_number', 'like', "%{$request->search}%");
        }

        return Inertia::render('Admin/Orders', [
            'orders' => $query->orderByDesc('created_at')->paginate(15),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled']);

        $updates = ['status' => $request->status];

        if ($request->status === 'confirmed') $updates['confirmed_at'] = now();
        if ($request->status === 'shipped') $updates['shipped_at'] = now();
        if ($request->status === 'delivered') {
            $updates['delivered_at'] = now();
            $updates['payment_status'] = 'paid';
        }

        $order->update($updates);
        return back()->with('success', 'Order status updated!');
    }

    // ─── SELLERS ───
    public function sellers()
    {
        $sellers = User::where('role', 'seller')
            ->with('sellerProfile')
            ->withCount('products')
            ->get();

        return Inertia::render('Admin/Sellers', [
            'sellers' => $sellers,
        ]);
    }

    public function generateInviteCode(Request $request)
    {
        // This endpoint is deprecated - seller registration no longer requires invitation codes
        return back()->with('error', 'Invitation codes are no longer used for seller registration.');
    }

    public function verifySeller(Request $request, User $seller)
    {
        if ($seller->role !== 'seller' || !$seller->sellerProfile) {
            return back()->with('error', 'Invalid seller.');
        }

        $seller->sellerProfile->update([
            'is_verified' => true
        ]);

        return back()->with('success', 'Seller verified successfully!');
    }
}
