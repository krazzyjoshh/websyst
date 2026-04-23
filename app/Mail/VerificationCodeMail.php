<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $code, public string $userType = 'customer')
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->userType === 'seller' 
                ? 'Seller Account Verification - Shop Hub' 
                : 'Verify Your Email - Shop Hub',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verification-code',
            with: [
                'code' => $this->code,
                'userType' => $this->userType,
            ],
        );
    }
}
