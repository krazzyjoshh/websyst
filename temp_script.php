<?php
use App\Models\User;
use Illuminate\Support\Facades\DB;

// Clear tables in proper order
echo "Deleting from seller_profiles...\n";
DB::table('seller_profiles')->delete();
echo "Done.\n\n";

echo "Deleting from users...\n";
DB::table('users')->delete();
echo "Done.\n\n";

echo "Truncating personal_access_tokens...\n";
DB::table('personal_access_tokens')->truncate();
echo "Done.\n\n";

echo "Truncating sessions...\n";
DB::table('sessions')->truncate();
echo "Done.\n\n";

echo "Truncating failed_jobs...\n";
DB::table('failed_jobs')->truncate();
echo "Done.\n\n";

// Create users
echo "Creating Admin user...\n";
$admin = User::create([
    'name' => 'Admin',
    'email' => 'joshua@gmail.com',
    'password' => bcrypt('adante12345'),
    'role' => 'admin',
    'email_verified_at' => now(),
]);
echo "Admin created: " . json_encode($admin->toArray()) . "\n\n";

echo "Creating Seller user...\n";
$seller = User::create([
    'name' => 'Seller',
    'email' => 'seller.joshua@gmail.com',
    'password' => bcrypt('adante12345'),
    'role' => 'seller',
    'email_verified_at' => now(),
]);
echo "Seller created: " . json_encode($seller->toArray()) . "\n\n";

echo "Creating User...\n";
$user = User::create([
    'name' => 'User',
    'email' => 'user.joshua@gmail.com',
    'password' => bcrypt('adante12345'),
    'role' => 'user',
    'email_verified_at' => now(),
]);
echo "User created: " . json_encode($user->toArray()) . "\n\n";

echo "All users created successfully!\n";
?>
