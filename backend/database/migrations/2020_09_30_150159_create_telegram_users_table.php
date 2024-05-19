<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTelegramUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'telegram_users',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->integer('telegram_user_id');
                $table->boolean('is_bot')->default(false);
                $table->string('first_name');
                $table->string('last_name')->nullable();
                $table->string('username')->nullable();
                $table->string('language_code')->nullable();
                $table->timestamps();
            }
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('telegram_users');
    }
}
