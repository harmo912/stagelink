<?php

use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\DomaineController;
use App\Http\Controllers\AdminAuthController;
use Illuminate\Support\Facades\Route;

// -------- Public --------
Route::get('/entreprises', [EntrepriseController::class, 'index']);
Route::get('/entreprises/{id}', [EntrepriseController::class, 'show']);
Route::get('/domaines', [DomaineController::class, 'index']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// -------- Réservé Admin (connecté) --------
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    Route::get('/admin/me', [AdminAuthController::class, 'me']);

    Route::post('/entreprises', [EntrepriseController::class, 'store']);
    Route::patch('/entreprises/{id}', [EntrepriseController::class, 'update']);
    Route::delete('/entreprises/{id}', [EntrepriseController::class, 'destroy']);

    Route::post('/domaines', [DomaineController::class, 'store']);
    Route::patch('/domaines/{id}', [DomaineController::class, 'update']);
    Route::delete('/domaines/{id}', [DomaineController::class, 'destroy']);
});