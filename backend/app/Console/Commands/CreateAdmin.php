<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class CreateAdmin extends Command
{
    // Options make it scriptable; anything omitted is prompted for interactively.
    protected $signature = 'admin:create
                            {--name= : Full name}
                            {--email= : Email address}
                            {--password= : Password (hidden prompt if omitted)}';

    protected $description = 'Create an admin user for the portal';

    public function handle(): int
    {
        $name = $this->option('name') ?: $this->ask('Full name');
        $email = $this->option('email') ?: $this->ask('Email address');
        $password = $this->option('password') ?: $this->secret('Password');

        $validator = Validator::make(
            compact('name', 'email', 'password'),
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', Password::defaults()],
            ],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        // The first CLI-created admin becomes the protected owner ("artisan")
        // with the full permission set — only this account can grant permissions
        // to and manage other users. Any later CLI admin is a normal admin.
        // The User model casts `password => 'hashed'`, so the plain value is
        // hashed on save.
        $isFirstOwner = ! User::where('is_owner', true)->exists();

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => $isFirstOwner ? 'owner' : 'admin',
            'is_active' => true,
            'is_owner' => $isFirstOwner,
            'can_reset_passwords' => true,
            'can_edit_profiles' => $isFirstOwner,
        ]);

        $label = $isFirstOwner ? 'Owner' : 'Admin';
        $this->info("{$label} created: {$user->email} (id {$user->id})");

        return self::SUCCESS;
    }
}
