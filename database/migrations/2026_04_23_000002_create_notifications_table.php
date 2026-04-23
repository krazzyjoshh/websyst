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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id'); // Admin user ID
            $table->unsignedBigInteger('recipient_id'); // User or Seller ID
            $table->string('type'); // 'admin_message', 'product_approval', 'product_rejected', etc.
            $table->string('title');
            $table->text('message');
            $table->text('action_data')->nullable(); // JSON data for action buttons/links
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('recipient_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('recipient_id');
            $table->index('read_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
