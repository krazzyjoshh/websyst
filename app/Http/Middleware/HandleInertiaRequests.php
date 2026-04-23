<?php

namespace App\Http\Middleware;

use Closure;
use Inertia\Inertia;

class HandleInertiaRequests
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next)
    {
        Inertia::share([
            'auth' => function () use ($request) {
                return [
                    'user' => $request->user() ? [
                        'id' => $request->user()->id,
                        'name' => $request->user()->name,
                        'email' => $request->user()->email,
                        'role' => $request->user()->role,
                        'avatar' => $request->user()->avatar,
                        'phone' => $request->user()->phone,
                    ] : null,
                ];
            },
            'flash' => function () use ($request) {
                return [
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                ];
            },
            'cartCount' => function () use ($request) {
                if ($request->user()) {
                    return \App\Models\CartItem::whereHas('cart', function ($q) use ($request) {
                        $q->where('user_id', $request->user()->id);
                    })->sum('quantity');
                }
                return 0;
            },
            'sellerProfile' => function () use ($request) {
                if ($request->user() && $request->user()->role === 'seller') {
                    $profile = $request->user()->sellerProfile;
                    if ($profile) {
                        return [
                            'shop_name' => $profile->shop_name,
                            'shop_logo' => $profile->shop_logo ?: null,
                        ];
                    }
                }
                return null;
            },
        ]);

        return $next($request);
    }
}
