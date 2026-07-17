<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('entreprise_domaine', function (Blueprint $table) {
            $table->unsignedBigInteger('idEntreprise');
            $table->unsignedBigInteger('idDomaine');
            $table->primary(['idEntreprise', 'idDomaine']);
            $table->foreign('idEntreprise')->references('idEntreprise')->on('entreprise')->onDelete('cascade');
            $table->foreign('idDomaine')->references('idDomaine')->on('domaine')->onDelete('cascade');
        });
    }
    public function down(): void { Schema::dropIfExists('entreprise_domaine'); }
};