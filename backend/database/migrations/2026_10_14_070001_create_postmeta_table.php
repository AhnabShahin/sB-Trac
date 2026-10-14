<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Each page's content is split into named sections (hero, stats, ...). One meta
// row per section, meta_value holding that section's JSON — ACF/WordPress-style,
// so a section's shape can evolve without a schema change.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('postmeta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts')->cascadeOnDelete();
            $table->string('meta_key');
            $table->longText('meta_value')->nullable();
            $table->timestamps();

            $table->unique(['post_id', 'meta_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('postmeta');
    }
};
