<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminCrudController;
use App\Http\Controllers\Admin\AdminMessagingController;
use App\Http\Controllers\Admin\ProductApprovalController;
use App\Http\Controllers\Seller\SellerDashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes - SHOP HUB
|--------------------------------------------------------------------------
*/

// ─── PUBLIC ───
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/category/{slug}', [ProductController::class, 'byCategory'])->name('category.show');

// ─── AUTH ───
Route::middleware('guest')->group(function () {
    // OTP Routes
    Route::post('/send-otp', [AuthController::class, 'sendOtp'])->name('otp.send');
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->name('otp.verify');

    // Customer auth
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);

    // Admin auth
    Route::get('/admin/login', [AuthController::class, 'showAdminLogin'])->name('admin.login');
    Route::post('/admin/login', [AuthController::class, 'adminLogin']);
    Route::get('/admin/register', [AuthController::class, 'showAdminRegister'])->name('admin.register');
    Route::post('/admin/register', [AuthController::class, 'adminRegister']);

    // Seller auth (separate portal)
    Route::get('/seller/login', [AuthController::class, 'showSellerLogin'])->name('seller.login');
    Route::post('/seller/login', [AuthController::class, 'sellerLogin']);
    Route::get('/seller/register', [AuthController::class, 'showSellerRegister'])->name('seller.register');
    Route::post('/seller/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ─── AUTHENTICATED USER ───
Route::middleware('auth')->group(function () {
    // Cart
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    // Profile
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update.post');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Notifications (Inertia pages)
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Notification API (JSON - for NotificationProvider polling)
    Route::prefix('api')->group(function () {
        Route::get('/notifications', [NotificationController::class, 'apiIndex']);
        Route::post('/notifications/{notification}/read', [NotificationController::class, 'apiMarkAsRead']);
        Route::post('/notifications/mark-all-read', [NotificationController::class, 'apiMarkAllAsRead']);
        Route::delete('/notifications/{notification}', [NotificationController::class, 'apiDelete']);
    });
});

// ─── ADMIN ───
Route::redirect('/admin', '/admin/dashboard');
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/users', [AdminCrudController::class, 'users'])->name('users');
    Route::put('/users/{user}', [AdminCrudController::class, 'updateUser'])->name('users.update');
    Route::delete('/users/{user}', [AdminCrudController::class, 'deleteUser'])->name('users.delete');

    Route::get('/products', [AdminCrudController::class, 'products'])->name('products');
    Route::post('/products', [AdminCrudController::class, 'storeProduct'])->name('products.store');
    Route::put('/products/{product}', [AdminCrudController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{product}', [AdminCrudController::class, 'deleteProduct'])->name('products.delete');

    Route::get('/categories', [AdminCrudController::class, 'categories'])->name('categories');
    Route::post('/categories', [AdminCrudController::class, 'storeCategory'])->name('categories.store');
    Route::put('/categories/{category}', [AdminCrudController::class, 'updateCategory'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminCrudController::class, 'deleteCategory'])->name('categories.delete');

    Route::get('/orders', [AdminCrudController::class, 'orders'])->name('orders');
    Route::put('/orders/{order}/status', [AdminCrudController::class, 'updateOrderStatus'])->name('orders.status');

    Route::get('/sellers', [AdminCrudController::class, 'sellers'])->name('sellers');
    Route::put('/sellers/{seller}/verify', [AdminCrudController::class, 'verifySeller'])->name('sellers.verify');

    // Admin messaging
    Route::get('/messaging', [AdminMessagingController::class, 'index'])->name('messaging');
    Route::post('/messages/send', [AdminMessagingController::class, 'sendMessage'])->name('messages.send');
    Route::post('/messages/send-to-all', [AdminMessagingController::class, 'sendToAll'])->name('messages.send_to_all');
    Route::get('/messages/sent', [AdminMessagingController::class, 'sentMessages'])->name('messages.sent');
    Route::get('/messages/unread', [AdminMessagingController::class, 'unreadMessages'])->name('messages.unread');
    Route::get('/messages/stats', [AdminMessagingController::class, 'messageStats'])->name('messages.stats');

    // Product approval workflow
    Route::get('/product-approvals', [ProductApprovalController::class, 'index'])->name('approvals.index');
    Route::get('/product-approvals/pending', [ProductApprovalController::class, 'pendingApprovals'])->name('approvals.pending');
    Route::get('/product-approvals/all', [ProductApprovalController::class, 'allApprovals'])->name('approvals.all');
    Route::get('/product-approvals/flagged', [ProductApprovalController::class, 'flaggedProducts'])->name('approvals.flagged');
    Route::post('/product-approvals/{approval}/approve', [ProductApprovalController::class, 'approve'])->name('approvals.approve');
    Route::post('/product-approvals/{approval}/reject', [ProductApprovalController::class, 'reject'])->name('approvals.reject');
    Route::get('/product-approvals/stats', [ProductApprovalController::class, 'stats'])->name('approvals.stats');
});

// ─── SELLER ───
Route::redirect('/admin/seller', '/admin/seller/dashboard');
Route::middleware(['auth', 'role:seller'])->prefix('admin/seller')->name('seller.')->group(function () {
    Route::get('/dashboard', [SellerDashboardController::class, 'index'])->name('dashboard');
    Route::get('/products', [SellerDashboardController::class, 'products'])->name('products');
    Route::post('/products', [SellerDashboardController::class, 'storeProduct'])->name('products.store');
    Route::put('/products/{product}', [SellerDashboardController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{product}', [SellerDashboardController::class, 'deleteProduct'])->name('products.delete');
    Route::get('/orders', [SellerDashboardController::class, 'orders'])->name('orders');
    Route::get('/settings', [SellerDashboardController::class, 'settings'])->name('settings');
    Route::post('/settings', [SellerDashboardController::class, 'updateSettings'])->name('settings.update');
});
