<!DOCTYPE html>
<html>
<head>
    <title>OTP Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #111827; margin-top: 0;">SHOP HUB Verification</h2>
        <p style="color: #374151; font-size: 16px;">Hello <strong>{{ $name }}</strong>,</p>
        <p style="color: #374151; font-size: 16px;">Please use the verification code below to complete your registration process.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; border: 1px dashed #d1d5db;">
            <h1 style="font-size: 36px; letter-spacing: 5px; color: #8b5cf6; margin: 0;">{{ $otp }}</h1>
        </div>
        
        <p style="color: #ef4444; font-size: 14px; font-weight: bold;">This code is valid for 5 minutes only.</p>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">If you didn't request this code, you can safely ignore this email.</p>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">&copy; {{ date('Y') }} SHOP HUB. All rights reserved.</p>
    </div>
</body>
</html>
