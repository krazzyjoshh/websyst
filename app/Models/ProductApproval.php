<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductApproval extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'seller_id',
        'status',
        'reviewed_by',
        'rejection_reason',
        'flagged_keywords',
        'reviewed_at',
    ];

    protected $casts = [
        'flagged_keywords' => 'array',
        'reviewed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the seller
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the admin who reviewed it
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Approve the product
     */
    public function approve($adminId)
    {
        $this->update([
            'status' => 'approved',
            'reviewed_by' => $adminId,
            'reviewed_at' => now(),
        ]);

        // Update product status
        $this->product->update(['approval_status' => 'approved', 'is_active' => true]);
    }

    /**
     * Reject the product
     */
    public function reject($adminId, $reason)
    {
        $this->update([
            'status' => 'rejected',
            'reviewed_by' => $adminId,
            'rejection_reason' => $reason,
            'reviewed_at' => now(),
        ]);

        // Update product status
        $this->product->update(['approval_status' => 'rejected', 'is_active' => false]);
    }

    /**
     * Scope: Get pending approvals
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope: Get products with flagged keywords
     */
    public function scopeFlagged($query)
    {
        return $query->whereNotNull('flagged_keywords');
    }
}
