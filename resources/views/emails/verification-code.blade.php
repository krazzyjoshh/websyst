<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .logo-main { color: #1f2937; }
        .logo-accent { color: #6366f1; }
        .title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #1f2937;
        }
        .subtitle {
            color: #6b7280;
            font-size: 14px;
        }
        .content {
            margin: 30px 0;
        }
        .code-section {
            background: #f3f4f6;
            border-left: 4px solid #6366f1;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            text-align: center;
        }
        .code {
            font-size: 36px;
            letter-spacing: 8px;
            font-weight: bold;
            color: #6366f1;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
        }
        .expire-text {
            color: #9ca3af;
            font-size: 12px;
            margin-top: 15px;
        }
        .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 14px;
            color: #92400e;
        }
        .footer {
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
            margin-top: 30px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
        .button {
            display: inline-block;
            background: #6366f1;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <span class="logo-main">SHOP</span><span class="logo-accent">HUB</span>
            </div>
            <div class="title">
                @if($userType === 'seller')
                    Seller Account Verification
                @else
                    Email Verification
                @endif
            </div>
            <div class="subtitle">
                @if($userType === 'seller')
                    Complete your seller registration
                @else
                    Verify your email address
                @endif
            </div>
        </div>

        <div class="content">
            <p>Hello,</p>
            
            @if($userType === 'seller')
                <p>Thank you for applying to become a seller on Shop Hub! To complete your registration, please verify your email address using the code below.</p>
            @else
                <p>Welcome to Shop Hub! Please verify your email address to complete your registration using the code below.</p>
            @endif

            <div class="code-section">
                <p style="margin: 0 0 10px 0; color: #6b7280;">Your Verification Code:</p>
                <div class="code">{{ $code }}</div>
                <p class="expire-text">This code expires in 10 minutes</p>
            </div>

            <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this code with anyone. Our team will never ask for this code via email or phone.
            </div>

            <p>
                @if($userType === 'seller')
                    If you didn't apply for a seller account, please ignore this email.
                @else
                    If you didn't create this account, please ignore this email.
                @endif
            </p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} Shop Hub. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
