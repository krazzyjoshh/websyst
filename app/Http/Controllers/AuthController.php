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
use App\Mail\OtpVerificationMail;
use App\Models\OtpVerification;
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

    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'role' => 'required|in:customer,seller',
            'first_name' => 'nullable|string'
        ]);

        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'This email is already registered.'], 422);
        }

        $code = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);

        OtpVerification::updateOrCreate(
            ['email' => $request->email],
            [
                'otp' => $code,
                'role' => $request->role,
                'is_verified' => false,
                'expires_at' => now()->addMinutes(5)
            ]
        );

        $name = $request->first_name ?? 'User';
        Mail::to($request->email)->send(new OtpVerificationMail($code, $name));

        return response()->json(['message' => 'OTP sent to your email.']);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $verification = OtpVerification::where('email', $request->email)->first();

        if (!$verification) {
            return response()->json(['message' => 'OTP record not found.'], 404);
        }

        if (!$verification->isValid($request->otp)) {
            return response()->json(['message' => 'Invalid or expired OTP code.'], 422);
        }

        $verification->update(['is_verified' => true]);

        return response()->json(['message' => 'OTP verified successfully.']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'gender' => 'required|in:male,female,other,prefer_not_to_say',
            'date_of_birth' => 'required|date',
            'street_address' => 'required|string',
            'barangay' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'nullable|in:customer,seller',
            // Seller specific
            'store_name' => 'nullable|string|required_if:role,seller',
            'store_description' => 'nullable|string',
        ]);

        $role = $request->role ?? 'customer';

        $verification = OtpVerification::where('email', $request->email)
            ->where('is_verified', true)
            ->first();

        if (!$verification) {
            return back()->withErrors(['email' => 'Please verify your email with OTP first before registering.']);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'name' => "{$request->first_name} {$request->last_name}",
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'street_address' => $request->street_address,
            'barangay' => $request->barangay,
            'city' => $request->city,
            'province' => $request->province,
            'role' => $role === 'seller' ? 'seller' : 'user',
            'account_type' => $role === 'seller' ? 'seller' : 'buyer',
            'email_verified' => true,
        ]);

        if ($role === 'seller') {
            \App\Models\SellerProfile::create([
                'user_id' => $user->id,
                'shop_name' => $request->store_name,
                'shop_description' => $request->store_description,
                'is_verified' => false,
            ]);
        }

        $verification->delete();

        Auth::login($user);
        $request->session()->regenerate();

        if ($role === 'seller') {
            return redirect()->route('seller.dashboard')->with('success', 'Seller account created!');
        }

        return redirect()->route('home')->with('success', 'Registration successful!');
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
