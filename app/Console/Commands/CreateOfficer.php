<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CreateOfficer extends Command
{
    protected $signature = 'officer:create {email} {--name=Officer}';
    protected $description = 'Create an officer account that can use the dashboard';

    public function handle(): int
    {
        $email = $this->argument('email');

        if (User::where('email', $email)->exists()) {
            $this->error("A user with {$email} already exists.");
            return self::FAILURE;
        }

        $password = $this->secret('Password (min 8 characters)');

        if (strlen((string) $password) < 8) {
            $this->error('Password must be at least 8 characters.');
            return self::FAILURE;
        }

        User::create(['name' => $this->option('name'), 'email' => $email, 'password' => $password]);
        $this->info("Officer {$email} created.");

        return self::SUCCESS;
    }
}
