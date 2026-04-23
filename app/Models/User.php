<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'gender',
        'date_of_birth',
        'avatar',
        'profile_photo',
        'phone',
        'phone_country_code',
        'alternative_email',
        'address',
        'street_address',
        'barangay',
        'city',
        'province',
        'zip_code',
        'country',
        'account_type',
        'email_verified',
        'otp_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_of_birth' => 'date',
        'otp_verified_at' => 'datetime',
    ];

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isSeller()
    {
        return $this->role === 'seller';
    }

    public function sellerProfile()
    {
        return $this->hasOne(SellerProfile::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    /**
     * Get notifications sent to this user
     */
    public function receivedNotifications()
    {
        return $this->hasMany(Notification::class, 'recipient_id');
    }

    /**
     * Get notifications sent by this admin
     */
    public function sentNotifications()
    {
        return $this->hasMany(Notification::class, 'sender_id');
    }

    /**
     * Get unread notifications for this user
     */
    public function unreadNotifications()
    {
        return $this->receivedNotifications()->unread();
    }

    /**
     * Get seller profile if user is seller
     */
    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
}
