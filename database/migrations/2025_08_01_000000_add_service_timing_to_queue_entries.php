<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
 | Records when each applicant was called and when they were finished, so the
 | app can work out the average service time and estimate waiting times.
 | The status column also becomes a plain string so a "cancelled" status
 | (applicant left the queue) can be stored.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            $table->string('status')->default('waiting')->change();
            $table->timestamp('called_at')->nullable()->after('status');
            $table->timestamp('completed_at')->nullable()->after('called_at');
        });
    }

    public function down(): void
    {
        Schema::table('queue_entries', function (Blueprint $table) {
            $table->dropColumn(['called_at', 'completed_at']);
        });
    }
};
