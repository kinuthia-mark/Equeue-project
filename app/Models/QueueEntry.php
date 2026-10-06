<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class QueueEntry extends Model
{
    use HasFactory;

    public const WAITING = 'waiting';

    public const IN_SERVICE = 'in_service';

    public const COMPLETED = 'completed';

    public const CANCELLED = 'cancelled';

    protected $fillable = [
        'token', 'name', 'email', 'service', 'service_number', 'status', 'queue_number',
        'called_at', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'called_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $entry) {
            $entry->token ??= (string) Str::uuid();
        });
    }

    public function getRouteKeyName(): string
    {
        return 'token';
    }

    public function serviceLabel(): string
    {
        return config("services_list.services.{$this->service}.label", $this->service);
    }

    public function statusLabel(): string
    {
        return ucfirst(str_replace('_', ' ', $this->status));
    }

    /** Number of people still waiting ahead of this entry in the same service. */
    public function peopleAhead(): int
    {
        if ($this->status !== self::WAITING) {
            return 0;
        }

        return static::where('service', $this->service)
            ->where('status', self::WAITING)
            ->where('id', '<', $this->id)
            ->count();
    }

    /**
     * Rough number of minutes until this person is called: everyone ahead,
     * plus whoever is at the counter now, times the average service time.
     * Returns null once the person is no longer waiting.
     */
    public function estimatedWaitMinutes(): ?int
    {
        if ($this->status !== self::WAITING) {
            return null;
        }

        $inService = static::nowServing($this->service) ? 1 : 0;

        return (int) round(($this->peopleAhead() + $inService) * static::averageServiceMinutes($this->service));
    }

    /** Minutes this person spent at the counter, once they are completed. */
    public function serviceMinutes(): ?float
    {
        if (! $this->called_at || ! $this->completed_at) {
            return null;
        }

        return $this->called_at->diffInSeconds($this->completed_at) / 60;
    }

    /**
     * Average minutes per applicant for a service, based on the most recent
     * completed entries. Falls back to the configured default when there is
     * no history yet.
     */
    public static function averageServiceMinutes(string $service): float
    {
        $recent = static::where('service', $service)
            ->where('status', self::COMPLETED)
            ->whereNotNull('called_at')
            ->whereNotNull('completed_at')
            ->orderByDesc('completed_at')
            ->limit(config('services_list.average_sample_size', 20))
            ->get(['called_at', 'completed_at']);

        if ($recent->isEmpty()) {
            return (float) config('services_list.default_service_minutes', 5);
        }

        return round($recent->avg(fn (self $e) => $e->serviceMinutes()), 1);
    }

    /** The entry currently being served for the given service, if any. */
    public static function nowServing(string $service): ?self
    {
        return static::where('service', $service)
            ->where('status', self::IN_SERVICE)
            ->orderByDesc('called_at')
            ->orderByDesc('id')
            ->first();
    }

    /** The next people waiting for a service, oldest first. */
    public static function upNext(string $service, int $limit = 3)
    {
        return static::where('service', $service)
            ->where('status', self::WAITING)
            ->orderBy('id')
            ->limit($limit)
            ->get();
    }
}
