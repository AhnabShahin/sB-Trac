<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Symfony\Component\HttpFoundation\Response;

// Admin user management: any signed-in admin can see the list and create more
// users (there's one shared "admin" role today). Resetting ANOTHER user's
// password is the one gated action — see resetPassword().
class UserController extends Controller
{
    private const PUBLIC_FIELDS = ['id', 'name', 'email', 'role', 'is_active', 'can_reset_passwords', 'created_at'];

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => User::orderBy('name')->get(self::PUBLIC_FIELDS),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::defaults()],
            'role' => ['sometimes', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
            'can_reset_passwords' => ['sometimes', 'boolean'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'] ?? 'admin',
            'is_active' => $data['is_active'] ?? true,
            'can_reset_passwords' => $data['can_reset_passwords'] ?? false,
        ]);

        return response()->json(['data' => $user->only(self::PUBLIC_FIELDS)], Response::HTTP_CREATED);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json(['data' => $user->only(self::PUBLIC_FIELDS)]);
    }

    /** Profile fields only — password changes go through resetPassword(). */
    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['sometimes', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
            'can_reset_passwords' => ['sometimes', 'boolean'],
        ]);

        // A user can't lock themselves out by deactivating their own account.
        if (array_key_exists('is_active', $data) && ! $data['is_active'] && $request->user()->id === $user->id) {
            abort(Response::HTTP_UNPROCESSABLE_ENTITY, "You can't deactivate your own account.");
        }

        $user->update($data);

        return response()->json(['data' => $user->only(self::PUBLIC_FIELDS)]);
    }

    /** Resetting your OWN password is always allowed; another user's requires `can_reset_passwords`. */
    public function resetPassword(Request $request, User $user): JsonResponse
    {
        $actingUser = $request->user();

        if ($actingUser->id !== $user->id && ! $actingUser->can_reset_passwords) {
            abort(Response::HTTP_FORBIDDEN, "You don't have permission to reset other users' passwords.");
        }

        $data = $request->validate([
            'password' => ['required', Password::defaults()],
        ]);

        $user->update(['password' => $data['password']]);

        return response()->json(['message' => 'Password updated.']);
    }
}
