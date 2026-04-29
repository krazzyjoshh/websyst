<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\SellerProfile;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // ─── ADMIN ───
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@shophub.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '09171234567',
        ]);

        // ─── SELLERS ───
        $sellers = [];
        $sellerData = [
            ['name' => 'TechVault PH', 'email' => 'seller1@shophub.com', 'shop' => 'TechVault Electronics'],
            ['name' => 'StyleCraft PH', 'email' => 'seller2@shophub.com', 'shop' => 'StyleCraft Fashion'],
            ['name' => 'HomeNest PH', 'email' => 'seller3@shophub.com', 'shop' => 'HomeNest Living'],
        ];

        foreach ($sellerData as $s) {
            $seller = User::create([
                'name' => $s['name'],
                'email' => $s['email'],
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '0917' . rand(1000000, 9999999),
            ]);
            SellerProfile::create([
                'user_id' => $seller->id,
                'shop_name' => $s['shop'],
                'shop_description' => 'Premium quality products at the best prices.',
                'total_earnings' => rand(50000, 500000),
                'total_sales' => rand(100, 2000),
                'rating' => rand(40, 50) / 10,
                'is_verified' => true,
            ]);
            $sellers[] = $seller;
        }

        // ─── USERS ───
        $users = [];
        for ($i = 1; $i <= 5; $i++) {
            $users[] = User::create([
                'name' => "Customer $i",
                'email' => "user$i@shophub.com",
                'password' => Hash::make('password'),
                'role' => 'user',
                'phone' => '0918' . rand(1000000, 9999999),
                'address' => "Block $i Lot " . ($i * 3) . " Rizal St.",
                'city' => ['Manila', 'Cebu', 'Davao', 'Quezon City', 'Makati'][$i - 1],
                'province' => ['Metro Manila', 'Cebu', 'Davao del Sur', 'Metro Manila', 'Metro Manila'][$i - 1],
                'zip_code' => (string)(1000 + $i * 100),
            ]);
        }

        // ─── CATEGORIES ───
        $categories = [
            [
                'name' => 'Furniture',
                'slug' => 'furniture',
                'description' => 'Beautiful furniture for your home',
                'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
                'icon' => 'sofa',
            ],
            [
                'name' => 'Bags',
                'slug' => 'bags',
                'description' => 'Stylish bags for every occasion',
                'image' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
                'icon' => 'briefcase',
            ],
            [
                'name' => 'Books',
                'slug' => 'books',
                'description' => 'Expand your mind with great reads',
                'image' => 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
                'icon' => 'book-open',
            ],
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Latest gadgets and tech',
                'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
                'icon' => 'cpu',
            ],
            [
                'name' => 'Apparel',
                'slug' => 'apparel',
                'description' => 'Trendy fashion for everyone',
                'image' => 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
                'icon' => 'shirt',
            ],
            [
                'name' => 'Shoes',
                'slug' => 'shoes',
                'description' => 'Step out in style',
                'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
                'icon' => 'footprints',
            ],
        ];

        foreach ($categories as $i => $cat) {
            $cat['sort_order'] = $i;
            Category::create($cat);
        }

        // ─── PRODUCTS ───
        $products = [
            // Electronics
            ['name' => 'Premium Wireless Headphones', 'slug' => 'premium-wireless-headphones', 'category_id' => 4, 'seller_id' => $sellers[0]->id, 'price' => 4999.00, 'compare_price' => 6999.00, 'description' => 'Immersive audio experience with active noise cancellation. 40-hour battery life, premium drivers, and ultra-comfortable ear cushions.', 'brand' => 'SoundMax', 'color' => 'Matte Black', 'material' => 'Premium Plastic', 'stock' => 150, 'sales_count' => 342, 'views' => 5200, 'rating' => 4.8, 'review_count' => 89, 'is_featured' => true, 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
            ['name' => 'Smart Watch Pro X', 'slug' => 'smart-watch-pro-x', 'category_id' => 4, 'seller_id' => $sellers[0]->id, 'price' => 8999.00, 'compare_price' => 12999.00, 'description' => 'Advanced fitness tracking, GPS, heart rate monitor, and blood oxygen sensor. AMOLED display with always-on feature.', 'brand' => 'TechWear', 'color' => 'Silver', 'material' => 'Stainless Steel', 'stock' => 80, 'sales_count' => 256, 'views' => 4100, 'rating' => 4.7, 'review_count' => 67, 'is_featured' => true, 'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
            ['name' => 'Mirrorless Camera 4K', 'slug' => 'mirrorless-camera-4k', 'category_id' => 4, 'seller_id' => $sellers[0]->id, 'price' => 35999.00, 'compare_price' => 42999.00, 'description' => 'Professional-grade mirrorless camera with 4K video, 26MP sensor, and 5-axis stabilization.', 'brand' => 'OptiLens', 'color' => 'Black', 'material' => 'Magnesium Alloy', 'stock' => 30, 'sales_count' => 78, 'views' => 3200, 'rating' => 4.9, 'review_count' => 34, 'is_featured' => true, 'image' => 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400'],
            ['name' => 'Wireless Earbuds Elite', 'slug' => 'wireless-earbuds-elite', 'category_id' => 4, 'seller_id' => $sellers[0]->id, 'price' => 3499.00, 'compare_price' => 4999.00, 'description' => 'True wireless earbuds with premium sound quality, 8-hour battery, and wireless charging case.', 'brand' => 'SoundMax', 'color' => 'White', 'stock' => 200, 'sales_count' => 567, 'views' => 7800, 'rating' => 4.6, 'review_count' => 145, 'is_featured' => false, 'image' => 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400'],
            ['name' => 'Portable Bluetooth Speaker', 'slug' => 'portable-bluetooth-speaker', 'category_id' => 4, 'seller_id' => $sellers[0]->id, 'price' => 2999.00, 'compare_price' => 3999.00, 'description' => 'Waterproof portable speaker with 360° sound, 24-hour battery, and deep bass technology.', 'brand' => 'SoundMax', 'color' => 'Blue', 'stock' => 120, 'sales_count' => 189, 'views' => 3400, 'rating' => 4.5, 'review_count' => 56, 'is_featured' => false, 'image' => 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'],

            // Shoes
            ['name' => 'Ultra Runner Sneakers', 'slug' => 'ultra-runner-sneakers', 'category_id' => 6, 'seller_id' => $sellers[1]->id, 'price' => 5999.00, 'compare_price' => 7999.00, 'description' => 'Lightweight running shoes with responsive cushioning and breathable mesh upper.', 'brand' => 'SprintX', 'color' => 'Red/Black', 'material' => 'Mesh/Rubber', 'size' => '42', 'stock' => 100, 'sales_count' => 234, 'views' => 4500, 'rating' => 4.7, 'review_count' => 78, 'is_featured' => true, 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
            ['name' => 'Classic Leather Boots', 'slug' => 'classic-leather-boots', 'category_id' => 6, 'seller_id' => $sellers[1]->id, 'price' => 7999.00, 'compare_price' => 9999.00, 'description' => 'Handcrafted genuine leather boots with Goodyear welt construction.', 'brand' => 'CraftStep', 'color' => 'Brown', 'material' => 'Genuine Leather', 'size' => '43', 'stock' => 50, 'sales_count' => 89, 'views' => 2100, 'rating' => 4.8, 'review_count' => 32, 'is_featured' => false, 'image' => 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400'],

            // Bags
            ['name' => 'Urban Explorer Backpack', 'slug' => 'urban-explorer-backpack', 'category_id' => 2, 'seller_id' => $sellers[1]->id, 'price' => 3499.00, 'compare_price' => 4999.00, 'description' => 'Water-resistant backpack with padded laptop compartment, USB charging port, and ergonomic design.', 'brand' => 'TrekGear', 'color' => 'Charcoal', 'material' => 'Nylon', 'stock' => 180, 'sales_count' => 312, 'views' => 5600, 'rating' => 4.6, 'review_count' => 94, 'is_featured' => true, 'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
            ['name' => 'Luxury Leather Tote', 'slug' => 'luxury-leather-tote', 'category_id' => 2, 'seller_id' => $sellers[1]->id, 'price' => 6999.00, 'compare_price' => 8999.00, 'description' => 'Elegant genuine leather tote bag with multiple compartments and gold hardware.', 'brand' => 'Elegance', 'color' => 'Tan', 'material' => 'Full-Grain Leather', 'stock' => 60, 'sales_count' => 145, 'views' => 3800, 'rating' => 4.9, 'review_count' => 41, 'is_featured' => false, 'image' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'],

            // Furniture
            ['name' => 'Scandinavian Sofa Set', 'slug' => 'scandinavian-sofa-set', 'category_id' => 1, 'seller_id' => $sellers[2]->id, 'price' => 24999.00, 'compare_price' => 32999.00, 'description' => 'Modern Scandinavian-inspired 3-seater sofa with premium fabric upholstery and solid wood legs.', 'brand' => 'NordHome', 'color' => 'Emerald Green', 'material' => 'Velvet', 'stock' => 20, 'sales_count' => 45, 'views' => 6700, 'rating' => 4.8, 'review_count' => 23, 'is_featured' => true, 'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
            ['name' => 'Minimalist Desk Lamp', 'slug' => 'minimalist-desk-lamp', 'category_id' => 1, 'seller_id' => $sellers[2]->id, 'price' => 1999.00, 'compare_price' => 2499.00, 'description' => 'Sleek LED desk lamp with adjustable brightness and color temperature.', 'brand' => 'LumiCraft', 'color' => 'Matte White', 'material' => 'Aluminum', 'stock' => 250, 'sales_count' => 456, 'views' => 4300, 'rating' => 4.5, 'review_count' => 112, 'is_featured' => false, 'image' => 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400'],

            // Books
            ['name' => 'The Art of Innovation', 'slug' => 'the-art-of-innovation', 'category_id' => 3, 'seller_id' => $sellers[2]->id, 'price' => 899.00, 'compare_price' => 1299.00, 'description' => 'A comprehensive guide to creative thinking and innovation in the modern world.', 'brand' => 'Penguin', 'stock' => 500, 'sales_count' => 789, 'views' => 9200, 'rating' => 4.7, 'review_count' => 234, 'is_featured' => false, 'image' => 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400'],
            ['name' => 'Digital Minimalism', 'slug' => 'digital-minimalism', 'category_id' => 3, 'seller_id' => $sellers[2]->id, 'price' => 749.00, 'compare_price' => 999.00, 'description' => 'Choosing a focused life in a noisy world. A philosophy for technology use.', 'brand' => 'Portfolio', 'stock' => 350, 'sales_count' => 567, 'views' => 7400, 'rating' => 4.6, 'review_count' => 167, 'is_featured' => false, 'image' => 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],

            // Apparel
            ['name' => 'Premium Cotton Hoodie', 'slug' => 'premium-cotton-hoodie', 'category_id' => 5, 'seller_id' => $sellers[1]->id, 'price' => 2499.00, 'compare_price' => 3499.00, 'description' => '400gsm premium cotton hoodie with kangaroo pocket and ribbed cuffs.', 'brand' => 'ThreadCo', 'color' => 'Heather Gray', 'material' => 'Cotton', 'size' => 'L', 'stock' => 200, 'sales_count' => 345, 'views' => 5600, 'rating' => 4.7, 'review_count' => 98, 'is_featured' => true, 'image' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'],
            ['name' => 'Linen Button-Down Shirt', 'slug' => 'linen-button-down-shirt', 'category_id' => 5, 'seller_id' => $sellers[1]->id, 'price' => 1899.00, 'compare_price' => 2499.00, 'description' => 'Breathable linen shirt perfect for tropical weather. Relaxed fit with wooden buttons.', 'brand' => 'ThreadCo', 'color' => 'Sky Blue', 'material' => 'Linen', 'size' => 'M', 'stock' => 150, 'sales_count' => 234, 'views' => 3200, 'rating' => 4.5, 'review_count' => 67, 'is_featured' => false, 'image' => 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'],
        ];

        foreach ($products as $pData) {
            $imageUrl = $pData['image'];
            unset($pData['image']);
            $pData['specifications'] = json_encode([
                'Brand' => $pData['brand'] ?? 'N/A',
                'Color' => $pData['color'] ?? 'N/A',
                'Material' => $pData['material'] ?? 'N/A',
            ]);
            $pData['approval_status'] = 'approved';
            $product = Product::create($pData);
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $imageUrl,
                'sort_order' => 0,
                'is_primary' => true,
            ]);
        }

        // ─── SAMPLE ORDERS ───
        $statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        $paymentMethods = ['cod', 'gcash', 'maya'];

        for ($i = 0; $i < 25; $i++) {
            $user = $users[array_rand($users)];
            $status = $statuses[array_rand($statuses)];
            $numItems = rand(1, 3);
            $orderProducts = Product::inRandomOrder()->limit($numItems)->get();
            $subtotal = 0;
            $items = [];

            foreach ($orderProducts as $op) {
                $qty = rand(1, 3);
                $total = $op->price * $qty;
                $subtotal += $total;
                $items[] = [
                    'product_id' => $op->id,
                    'seller_id' => $op->seller_id,
                    'product_name' => $op->name,
                    'product_price' => $op->price,
                    'quantity' => $qty,
                    'total' => $total,
                ];
            }

            $shippingFee = $subtotal >= 5000 ? 0 : 150;
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $user->id,
                'customer_name' => $user->name,
                'customer_email' => $user->email,
                'customer_phone' => $user->phone ?? '09170000000',
                'shipping_address' => $user->address ?? '123 Sample St.',
                'city' => $user->city ?? 'Manila',
                'province' => $user->province ?? 'Metro Manila',
                'zip_code' => $user->zip_code ?? '1000',
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'discount' => 0,
                'total' => $subtotal + $shippingFee,
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'payment_status' => $status === 'delivered' ? 'paid' : 'pending',
                'status' => $status,
                'created_at' => now()->subDays(rand(0, 60)),
            ]);

            foreach ($items as $item) {
                OrderItem::create(array_merge($item, ['order_id' => $order->id]));
            }
        }

        // ─── SAMPLE REVIEWS ───
        $allProducts = Product::all();
        foreach ($allProducts as $product) {
            $reviewCount = rand(2, 5);
            for ($i = 0; $i < $reviewCount; $i++) {
                $user = $users[array_rand($users)];
                Review::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'rating' => rand(3, 5),
                    'comment' => [
                        'Great product! Exactly as described.',
                        'Good quality for the price. Would recommend.',
                        'Fast shipping and well-packaged.',
                        'Excellent value. Will buy again!',
                        'Very satisfied with this purchase.',
                        'Amazing quality! Exceeded my expectations.',
                        'Good product but shipping took a while.',
                        'Love it! Perfect for everyday use.',
                    ][array_rand([0, 1, 2, 3, 4, 5, 6, 7])],
                    'is_approved' => true,
                    'created_at' => now()->subDays(rand(0, 90)),
                ]);
            }
        }

        echo "\n✅ SHOP HUB seeded successfully!\n";
        echo "Admin: admin@shophub.com / password\n";
        echo "Seller: seller1@shophub.com / password\n";
        echo "User: user1@shophub.com / password\n";
    }
}
