<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Demo officer for local development only.
        if (app()->environment('local')) {
            User::updateOrCreate(
                ['email' => 'officer@example.com'],
                ['name' => 'Demo Officer', 'password' => 'password']
            );
        }
    }
}
