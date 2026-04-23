<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Mail\VerificationCodeMail;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();

            if ($user->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }
            if ($user->role === 'seller') {
                return redirect()->route('seller.dashboard');
            }
            return redirect()->route('home');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        // This endpoint is deprecated - use /register/send-otp and /register/verify-otp instead
        return response()->json(['message' => 'Please use the OTP-based registration flow.'], 400);
    }

    public function sendRegisterOTP(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:20',
            'phone_country_code' => 'required|string|max:10',
            'date_of_birth' => 'required|date|before:today',
            'gender' => 'required|in:male,female,other,prefer_not_to_say',
            'street_address' => 'required|string',
            'barangay' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'zip_code' => 'required|string',
            'country' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
            'agree_terms' => 'required|accepted',
        ]);

        // Check if email already exists
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'This email is already registered.'], 422);
        }

        // Generate 6-digit OTP
        $code = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Delete any existing verification codes for this email
        DB::table('email_verification_codes')->where('email', $request->email)->delete();

        // Store the OTP code
        DB::table('email_verification_codes')->insert([
            'email' => $request->email,
            'code' => $code,
            'expires_at' => now()->addMinutes(5),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Send OTP to email
        Mail::to($request->email)->send(new VerificationCodeMail($code, 'customer'));

        return response()->json(['message' => 'OTP sent to your email.']);
    }

    public function verifyRegisterOTP(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'phone' => 'required|string|max:20',
            'phone_country_code' => 'required|string|max:10',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other,prefer_not_to_say',
            'street_address' => 'required|string',
            'barangay' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'zip_code' => 'required|string',
            'country' => 'required|string',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|string',
        ]);

        // Verify OTP
        $verification = DB::table('email_verification_codes')
            ->where('email', $request->email)
            ->where('code', $request->otp)
            ->first();

        if (!$verification) {
            return response()->json(['message' => 'Invalid verification code.'], 422);
        }

        if (now()->isAfter($verification->expires_at)) {
            return response()->json(['message' => 'Verification code has expired.'], 422);
        }

        if ($verification->attempts >= 5) {
            return response()->json(['message' => 'Too many failed attempts. Please request a new code.'], 422);
        }

        // Check if email already exists
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'This email is already registered.'], 422);
        }

        // Create user with all details
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'name' => "{$request->first_name} {$request->last_name}",
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'phone_country_code' => $request->phone_country_code,
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'street_address' => $request->street_address,
            'barangay' => $request->barangay,
            'city' => $request->city,
            'province' => $request->province,
            'zip_code' => $request->zip_code,
            'country' => $request->country,
            'role' => 'user',
            'account_type' => 'buyer',
            'email_verified' => true,
            'otp_verified_at' => now(),
        ]);

        // Mark OTP as verified
        DB::table('email_verification_codes')
            ->where('email', $request->email)
            ->update(['verified_at' => now()]);

        Auth::login($user);

        return response()->json(['message' => 'Registration successful!', 'redirect' => route('home')]);
    }

    public function showSellerLogin()
    {
        return Inertia::render('Auth/SellerLogin');
    }

    public function sellerLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user();
            if ($user->role !== 'seller') {
                Auth::logout();
                return back()->withErrors(['email' => 'This account is not a seller account.']);
            }
            $request->session()->regenerate();
            return redirect()->route('seller.dashboard');
        }

        return back()->withErrors(['email' => 'The provided credentials do not match our records.']);
    }

    public function showSellerRegister()
    {
        return Inertia::render('Auth/SellerRegister');
    }

    public function sellerRegister(Request $request)
    {
        // This endpoint is deprecated - use /seller/register/send-otp and /seller/register/verify-otp instead
        return response()->json(['message' => 'Please use the OTP-based registration flow.'], 400);
    }

    public function sendSellerRegisterOTP(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:20',
            'phone_country_code' => 'required|string|max:10',
            'date_of_birth' => 'required|date|before:today',
            'gender' => 'required|in:male,female,other,prefer_not_to_say',
            'street_address' => 'required|string',
            'barangay' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'zip_code' => 'required|string',
            'country' => 'required|string',
            'store_name' => 'required|string|max:255',
            'store_description' => 'nullable|string',
            'password' => 'required|string|min:8|confirmed',
            'agree_terms' => 'required|accepted',
        ]);

        // Check if email already exists
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'This email is already registered.'], 422);
        }

        // Generate 6-digit OTP
        $code = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Delete any existing verification codes for this email
        DB::table('email_verification_codes')->where('email', $request->email)->delete();

        // Store the OTP code
        DB::table('email_verification_codes')->insert([
            'email' => $request->email,
            'code' => $code,
            'expires_at' => now()->addMinutes(5),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Send OTP to email
        Mail::to($request->email)->send(new VerificationCodeMail($code, 'seller'));

        return response()->json(['message' => 'OTP sent to your email.']);
    }

    public function verifySellerRegisterOTP(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'phone' => 'required|string|max:20',
            'phone_country_code' => 'required|string|max:10',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other,prefer_not_to_say',
            'street_address' => 'required|string',
            'barangay' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'zip_code' => 'required|string',
            'country' => 'required|string',
            'store_name' => 'required|string',
            'store_description' => 'nullable|string',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|string',
        ]);

        // Verify OTP
        $verification = DB::table('email_verification_codes')
            ->where('email', $request->email)
            ->where('code', $request->otp)
            ->first();

        if (!$verification) {
            return response()->json(['message' => 'Invalid verification code.'], 422);
        }

        if (now()->isAfter($verification->expires_at)) {
            return response()->json(['message' => 'Verification code has expired.'], 422);
        }

        if ($verification->attempts >= 5) {
            return response()->json(['message' => 'Too many failed attempts. Please request a new code.'], 422);
        }

        // Check if email already exists
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'This email is already registered.'], 422);
        }

        // Create seller user - pending admin verification
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'name' => "{$request->first_name} {$request->last_name}",
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'phone_country_code' => $request->phone_country_code,
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'street_address' => $request->street_address,
            'barangay' => $request->barangay,
            'city' => $request->city,
            'province' => $request->province,
            'zip_code' => $request->zip_code,
            'country' => $request->country,
            'role' => 'seller',
            'account_type' => 'seller',
            'email_verified' => true,
            'otp_verified_at' => now(),
        ]);

        // Create seller profile - pending admin approval
        \App\Models\SellerProfile::create([
            'user_id' => $user->id,
            'shop_name' => $request->store_name,
            'shop_description' => $request->store_description,
            'is_verified' => false,
        ]);

        // Mark OTP as verified
        DB::table('email_verification_codes')
            ->where('email', $request->email)
            ->update(['verified_at' => now()]);

        return response()->json([
            'message' => 'Account created! Your seller application is pending admin review.',
            'redirect' => route('seller.login')
        ]);
    }

    public function showAdminLogin()
    {
        return Inertia::render('Auth/AdminLogin');
    }

    public function adminLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user();
            if ($user->role !== 'admin') {
                Auth::logout();
                return back()->withErrors(['email' => 'This account is not an admin account.']);
            }
            $request->session()->regenerate();
            return redirect()->route('admin.dashboard');
        }

        return back()->withErrors(['email' => 'The provided credentials do not match our records.']);
    }

    public function showAdminRegister()
    {
        // Admin registration is now handled through a separate, secure process
        return Inertia::render('Auth/AdminRegister');
    }

    public function adminRegister(Request $request)
    {
        // Admin registration is disabled - only authorized users can create admin accounts
        return response()->json(['message' => 'Admin registration is disabled.'], 403);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home');
    }
}
