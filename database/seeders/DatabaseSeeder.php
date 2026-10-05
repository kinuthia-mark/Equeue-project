<?php

namespace Database\Seeders;

use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    private const NAMES = [
        'Wanjiku Kamau', 'Brian Otieno', 'Achieng Odhiambo', 'Kevin Mutua', 'Faith Chebet',
        'Dennis Kiprop', 'Mercy Njeri', 'Hassan Abdi', 'Grace Wambui', 'Peter Mwangi',
    ];

    public function run(): void
    {
        // Demo data is for local development only, never production.
        if (! app()->environment('local')) {
            return;
        }

        User::updateOrCreate(
            ['email' => 'officer@example.com'],
            ['name' => 'Demo Officer', 'password' => 'password']
        );

        // Only add sample queues to an empty table, so re-seeding is safe.
        if (QueueEntry::exists()) {
            return;
        }

        foreach (config('services_list.services') as $slug => $service) {
            $this->seedService($slug, $service['prefix']);
        }
    }

    /** A morning's worth of history, someone at the counter and a short line. */
    private function seedService(string $slug, string $prefix): void
    {
        $number = 0;
        $add = function (string $status, array $extra = []) use ($slug, $prefix, &$number) {
            $number++;
            $name = self::NAMES[array_rand(self::NAMES)];

            QueueEntry::create([
                'name' => $name,
                'email' => strtolower(str_replace(' ', '.', $name)).'@example.com',
                'service' => $slug,
                'service_number' => $number,
                'queue_number' => sprintf('%s-%03d', $prefix, $number),
                'status' => $status,
            ] + $extra);
        };

        $clock = now()->subHours(2);
        foreach (range(1, rand(3, 6)) as $ignored) {
            $called = $clock->copy();
            $clock->addMinutes(rand(3, 9));
            $add(QueueEntry::COMPLETED, ['called_at' => $called, 'completed_at' => $clock->copy()]);
        }

        $add(QueueEntry::IN_SERVICE, ['called_at' => now()->subMinutes(rand(1, 4))]);

        foreach (range(1, rand(1, 4)) as $ignored) {
            $add(QueueEntry::WAITING);
        }
    }
}
