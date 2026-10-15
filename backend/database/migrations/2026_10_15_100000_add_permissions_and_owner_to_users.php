<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Permission: may edit ANOTHER user's profile (name/email). Editing
            // your own profile is always allowed. An owner-protected row
            // (is_owner) is never editable by anyone but the owner itself.
            $table->boolean('can_edit_profiles')->default(false)->after('can_reset_passwords');
            // The single protected "artisan"/owner account. Only the owner can
            // change the owner's own profile and permissions; no delegated
            // permission lets another user touch an owner row. Granting
            // permissions to others is an owner-only action.
            $table->boolean('is_owner')->default(false)->after('can_edit_profiles');
        });

        // Promote the pre-existing root admin (the CLI-created account, lowest
        // id) to owner so the live DB keeps a working super-user after this
        // migration. Give it the full permission set.
        $root = DB::table('users')->orderBy('id')->first();
        if ($root) {
            DB::table('users')->where('id', $root->id)->update([
                'is_owner' => true,
                'can_edit_profiles' => true,
                'can_reset_passwords' => true,
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['can_edit_profiles', 'is_owner']);
        });
    }
};
