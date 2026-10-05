<?php

namespace Database\Factories;

use App\Models\QueueEntry;
use Illuminate\Database\Eloquent\Factories\Factory;

class QueueEntryFactory extends Factory
{
    protected $model = QueueEntry::class;

    public function definition(): array
    {
        $service = fake()->randomElement(array_keys(config('services_list.services')));
        $n = fake()->unique()->numberBetween(1, 100000);

        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'service' => $service,
            'service_number' => $n,
            'queue_number' => config("services_list.services.$service.prefix").'-'.str_pad($n, 3, '0', STR_PAD_LEFT),
            'status' => QueueEntry::WAITING,
        ];
    }
}
