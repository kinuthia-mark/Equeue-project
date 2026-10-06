<?php

use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\OfficerController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Public: applicants
Route::get('/', [ApplicantController::class, 'showForm'])->name('home');
Route::post('/submit', [ApplicantController::class, 'submit'])->middleware('throttle:10,1')->name('submit');
Route::get('/status/{entry}', [ApplicantController::class, 'status'])->name('status');
Route::get('/status/{entry}/json', [ApplicantController::class, 'statusJson'])->name('status.json');
Route::post('/status/{entry}/leave', [ApplicantController::class, 'leave'])->name('status.leave');

// Public: waiting-room display board (queue numbers only, no personal data)
Route::get('/board', [BoardController::class, 'show'])->name('board');
Route::get('/board/json', [BoardController::class, 'json'])->name('board.json');

// Officer login/logout only. Public registration is disabled on purpose:
// officer accounts are created with `php artisan officer:create`.
Auth::routes(['register' => false, 'verify' => false]);

// Officers
Route::middleware('auth')->prefix('officer')->group(function () {
    Route::get('/', [OfficerController::class, 'dashboard'])->name('officer.dashboard');
    Route::post('/call-next', [OfficerController::class, 'callNext'])->name('officer.call-next');
    Route::post('/complete/{entry}', [OfficerController::class, 'complete'])->name('officer.complete');
});
