<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtpVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'otp',
        'role',
        'is_verified',
        'expires_at',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'expires_at' => 'datetime',
    ];

    /**
     * Check if the OTP is valid (matches and not expired).
     */
    public function isValid($otp)
    {
        return $this->otp === $otp && !$this->isExpired();
    }

    /**
     * Check if the OTP is expired.
     */
    public function isExpired()
    {
        return now()->greaterThan($this->expires_at);
    }
}
