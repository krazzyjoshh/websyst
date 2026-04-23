<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'seller_id', 'name', 'slug', 'description', 'specifications',
        'price', 'compare_price', 'stock', 'sku', 'brand', 'color', 'material',
        'size', 'weight', 'views', 'sales_count', 'rating', 'review_count',
        'is_featured', 'is_active', 'approval_status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'approval_status' => 'string',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function approval()
    {
        return $this->hasOne(ProductApproval::class);
    }

    public function getDiscountPercentAttribute()
    {
        if ($this->compare_price && $this->compare_price > $this->price) {
            return round((($this->compare_price - $this->price) / $this->compare_price) * 100);
        }
        return 0;
    }

    public function getMainImageAttribute()
    {
        $primary = $this->images->where('is_primary', true)->first();
        return $primary ? $primary->image_path : ($this->images->first() ? $this->images->first()->image_path : null);
    }
}
