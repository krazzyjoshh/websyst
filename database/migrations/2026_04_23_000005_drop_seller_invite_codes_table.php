<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the seller_invite_codes table as invitation system is removed
        Schema::dropIfExists('seller_invite_codes');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('seller_invite_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('used_by')->nullable();
            $table->timestamp('used_at')->nullable();
            $table->boolean('is_used')->default(false);
            $table->text('note')->nullable();
            $table->timestamps();
            
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('used_by')->references('id')->on('users')->onDelete('set null');
        });
    }
};
