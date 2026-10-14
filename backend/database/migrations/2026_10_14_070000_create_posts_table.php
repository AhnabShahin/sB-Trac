<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// WordPress-style content store: one row per editable page (post_type 'page'),
// keyed by a unique slug that maps 1:1 to a frontend route. Richer post types
// (e.g. 'project', 'product') reuse the same table later.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('post_type')->default('page')->index();
            $table->string('slug')->unique();
            $table->string('title')->nullable();
            $table->string('status')->default('published');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
