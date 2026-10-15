<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Symfony\Component\HttpFoundation\Response;

// Admin user management. Authorization model (mirrored on the frontend):
//
//  - OWNER ("artisan"): a single protected super-user. Only the owner can edit
//    the owner's own profile and permissions — no delegated permission lets any
//    other account touch an owner row. Granting/changing permissions, roles and
//    active status for everyone else is owner-only.
//  - `can_edit_profiles`: lets a non-owner edit OTHER (non-owner) users' profile
//    fields (name/email) only — never their permissions or status.
//  - `can_reset_passwords`: lets a non-owner reset OTHER (non-owner) users'
//    passwords. Resetting your own password is always allowed.
//  - Editing your OWN profile (name/email) and password is always allowed.
class UserController extends Controller
{
    private const PUBLIC_FIELDS = [
        'id', 'name', 'email', 'role', 'is_active',
        'can_reset_passwords', 'can_edit_profiles', 'is_owner', 'created_at',
    ];

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => User::orderByDesc('is_owner')->orderBy('name')->get(self::PUBLIC_FIELDS),
        ]);
    }

    /** Creating accounts assigns permissions, so it is an owner-only action. */
    public function store(Request $request): JsonResponse
    {
        $this->assertOwner($request->user());

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::defaults()],
            'role' => ['sometimes', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
            'can_reset_passwords' => ['sometimes', 'boolean'],
            'can_edit_profiles' => ['sometimes', 'boolean'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'] ?? 'admin',
            'is_active' => $data['is_active'] ?? true,
            'can_reset_passwords' => $data['can_reset_passwords'] ?? false,
            'can_edit_profiles' => $data['can_edit_profiles'] ?? false,
            // Ownership is never granted through the API.
            'is_owner' => false,
        ]);

        return response()->json(['data' => $user->only(self::PUBLIC_FIELDS)], Response::HTTP_CREATED);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json(['data' => $user->only(self::PUBLIC_FIELDS)]);
    }

    /**
     * Profile fields (name/email) and permission fields (role, status, flags)
     * are gated independently; password changes go through resetPassword().
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $actor = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['sometimes', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
            'can_reset_passwords' => ['sometimes', 'boolean'],
            'can_edit_profiles' => ['sometimes', 'boolean'],
        ]);

        // Ownership can never be set or transferred through the API.
        unset($data['is_owner']);

        $profileKeys = ['name', 'email'];
        $permissionKeys = ['role', 'is_active', 'can_reset_passwords', 'can_edit_profiles'];

        $touchesProfile = (bool) array_intersect(array_keys($data), $profileKeys);
        $touchesPermissions = (bool) array_intersect(array_keys($data), $permissionKeys);

        if ($touchesProfile && ! $this->canEditProfile($actor, $user)) {
            abort(Response::HTTP_FORBIDDEN, "You don't have permission to edit this user's profile.");
        }

        if ($touchesPermissions && ! $this->canManage($actor, $user)) {
            abort(Response::HTTP_FORBIDDEN, "Only the owner can change permissions, role or account status.");
        }

        // A user can't lock themselves out by deactivating their own account.
        if (array_key_exists('is_active', $data) && ! $data['is_active'] && $actor->id === $user->id) {
            abort(Response::HTTP_UNPROCESSABLE_ENTITY, "You can't deactivate your own account.");
        }

        $user->update($data);

        return response()->json(['data' => $user->only(self::PUBLIC_FIELDS)]);
    }

    public function resetPassword(Request $request, User $user): JsonResponse
    {
        $actor = $request->user();

        if (! $this->canResetPassword($actor, $user)) {
            abort(Response::HTTP_FORBIDDEN, "You don't have permission to reset this user's password.");
        }

        $data = $request->validate([
            'password' => ['required', Password::defaults()],
        ]);

        $user->update(['password' => $data['password']]);

        return response()->json(['message' => 'Password updated.']);
    }

    private function assertOwner(User $actor): void
    {
        abort_unless($actor->is_owner, Response::HTTP_FORBIDDEN, 'Only the owner can perform this action.');
    }

    /** Edit $target's profile (name/email)? */
    private function canEditProfile(User $actor, User $target): bool
    {
        if ($actor->id === $target->id) {
            return true;
        }

        // An owner row is only ever editable by the owner itself.
        if ($target->is_owner) {
            return false;
        }

        return $actor->is_owner || $actor->can_edit_profiles;
    }

    /** Change $target's permissions / role / active status? Owner-only. */
    private function canManage(User $actor, User $target): bool
    {
        // The owner's own permissions are self-managed only; nobody else.
        if ($target->is_owner) {
            return $actor->is_owner && $actor->id === $target->id;
        }

        return $actor->is_owner;
    }

    /** Reset $target's password? */
    private function canResetPassword(User $actor, User $target): bool
    {
        if ($target->is_owner) {
            return $actor->id === $target->id;
        }

        if ($actor->id === $target->id) {
            return true;
        }

        return $actor->is_owner || $actor->can_reset_passwords;
    }
}
