<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Contact-form submissions from the public /contact page. Kept in its own table
// (not the posts/postmeta content store) because these are user-generated
// records the admin reads and triages, not editable page content.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('company');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('service');
            $table->string('location')->nullable();
            $table->string('budget')->nullable();
            $table->text('message');
            $table->boolean('newsletter')->default(false);
            // new | read | archived — drives the admin status filter.
            $table->string('status')->default('new')->index();
            $table->string('ip_address')->nullable();
            $table->timestamps();

            // The admin list sorts newest-first and filters by service/status.
            $table->index('created_at');
            $table->index('service');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
