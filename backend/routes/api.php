<?php

use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\DomaineController;
use App\Http\Controllers\AdminAuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;

// -------- Public --------
Route::get('/entreprises', [EntrepriseController::class, 'index']);
Route::get('/entreprises/{id}', [EntrepriseController::class, 'show']);
Route::post('/messages', [MessageController::class, 'store']);
Route::get('/domaines', [DomaineController::class, 'index']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// -------- Réservé Admin (connecté) --------
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    Route::get('/admin/me', [AdminAuthController::class, 'me']);
    Route::get('/messages', [MessageController::class, 'index']);
    Route::delete('/messages/{id}', [MessageController::class, 'destroy']);

    Route::post('/entreprises', [EntrepriseController::class, 'store']);
    Route::patch('/entreprises/{id}', [EntrepriseController::class, 'update']);
    Route::delete('/entreprises/{id}', [EntrepriseController::class, 'destroy']);

    Route::post('/domaines', [DomaineController::class, 'store']);
    Route::patch('/domaines/{id}', [DomaineController::class, 'update']);
    Route::delete('/domaines/{id}', [DomaineController::class, 'destroy']);
});