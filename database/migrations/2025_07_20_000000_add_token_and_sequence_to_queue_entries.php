<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            $table->uuid('token')->nullable()->unique()->after('id');
            $table->unsignedInteger('service_number')->default(0)->after('service');
            $table->index(['service', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            $table->dropIndex(['service', 'status']);
            $table->dropUnique(['token']);
            $table->dropColumn(['token', 'service_number']);
        });
    }
};
