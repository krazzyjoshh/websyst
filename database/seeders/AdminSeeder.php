<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SellerProfile;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed the default accounts for admin, seller, and user roles.
     *
     * @return void
     */
    public function run()
    {
        // ─── ADMIN ACCOUNT ───
        User::updateOrCreate(
            ['email' => 'admin@shophub.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // ─── SELLER ACCOUNT ───
        $seller = User::updateOrCreate(
            ['email' => 'seller@shophub.com'],
            [
                'name' => 'Shop Hub Seller',
                'password' => Hash::make('seller123'),
                'role' => 'seller',
                'email_verified_at' => now(),
            ]
        );

        // Create seller profile if it doesn't exist
        SellerProfile::updateOrCreate(
            ['user_id' => $seller->id],
            [
                'shop_name' => 'Default Shop',
                'shop_description' => 'Welcome to our shop! We offer premium quality products.',
                'is_verified' => true,
            ]
        );

        // ─── USER ACCOUNT ───
        User::updateOrCreate(
            ['email' => 'user@shophub.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('user1234'),
                'role' => 'user',
                'email_verified_at' => now(),
                'phone' => '09171234567',
                'address' => '123 Main Street',
                'city' => 'Manila',
                'province' => 'Metro Manila',
                'zip_code' => '1000',
            ]
        );

        echo "\n✅ Default accounts created successfully!\n";
        echo "──────────────────────────────────────\n";
        echo "👑 Admin:  admin@shophub.com  / admin123\n";
        echo "🏪 Seller: seller@shophub.com / seller123\n";
        echo "👤 User:   user@shophub.com   / user1234\n";
        echo "──────────────────────────────────────\n";
    }
}
