<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('message_contact', function (Blueprint $table) {
            $table->id('idMessage');
            $table->string('nom', 100);
            $table->string('email', 150);
            $table->text('message');
            $table->timestamp('dateEnvoi')->useCurrent();
        });
    }
    public function down(): void { Schema::dropIfExists('message_contact'); }
};