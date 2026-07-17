<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('entreprise', function (Blueprint $table) {
            $table->id('idEntreprise');
            $table->string('nom', 150);
            $table->string('ville', 100)->nullable();
            $table->string('telephone', 30)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('siteWeb', 255)->nullable();
        });
    }
    public function down(): void { Schema::dropIfExists('entreprise'); }
};