<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('domaine', function (Blueprint $table) {
            $table->id('idDomaine');
            $table->string('nomDomaine', 100)->unique();
        });
    }
    public function down(): void { Schema::dropIfExists('domaine'); }
};