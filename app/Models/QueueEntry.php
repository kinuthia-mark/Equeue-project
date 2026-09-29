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

    protected $fillable = [
        'token', 'name', 'email', 'service', 'service_number', 'status', 'queue_number',
    ];

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

    /** The entry currently being served for the given service, if any. */
    public static function nowServing(string $service): ?self
    {
        return static::where('service', $service)
            ->where('status', self::IN_SERVICE)
            ->orderByDesc('updated_at')
            ->first();
    }
}
