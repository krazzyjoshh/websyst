<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add registration fields to users table using raw SQL to avoid Doctrine DBAL dependency
        DB::statement("
            ALTER TABLE users
            ADD COLUMN first_name VARCHAR(255) NULL AFTER name,
            ADD COLUMN last_name VARCHAR(255) NULL AFTER first_name,
            ADD COLUMN gender ENUM('male', 'female', 'other', 'prefer_not_to_say') NULL AFTER last_name,
            ADD COLUMN date_of_birth DATE NULL AFTER gender,
            ADD COLUMN profile_photo VARCHAR(255) NULL AFTER date_of_birth,
            ADD COLUMN phone_country_code VARCHAR(10) DEFAULT '+63' AFTER phone,
            ADD COLUMN alternative_email VARCHAR(255) NULL AFTER email,
            ADD COLUMN street_address VARCHAR(255) NULL AFTER address,
            ADD COLUMN barangay VARCHAR(255) NULL AFTER street_address,
            ADD COLUMN country VARCHAR(255) DEFAULT 'Philippines' AFTER province,
            ADD COLUMN account_type ENUM('buyer', 'seller') DEFAULT 'buyer' AFTER role,
            ADD COLUMN otp_verified_at TIMESTAMP NULL AFTER email_verified
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("
            ALTER TABLE users
            DROP COLUMN first_name,
            DROP COLUMN last_name,
            DROP COLUMN gender,
            DROP COLUMN date_of_birth,
            DROP COLUMN profile_photo,
            DROP COLUMN phone_country_code,
            DROP COLUMN alternative_email,
            DROP COLUMN street_address,
            DROP COLUMN barangay,
            DROP COLUMN country,
            DROP COLUMN account_type,
            DROP COLUMN otp_verified_at
        ");
    }
};
