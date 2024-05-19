<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTelegramBotTelegramUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'telegram_bot_telegram_user',
            function (Blueprint $table) {
                $table->id();
                $table->uuid('telegram_bot_id');
                $table->uuid('telegram_user_id');
                $table->timestamps();

                $table->foreign('telegram_bot_id')->references('id')->on('telegram_bots')->onDelete('cascade');
                $table->foreign('telegram_user_id')->references('id')->on('telegram_users')->onDelete('cascade');
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
        Schema::dropIfExists('telegram_users_telegram_bots');
    }
}
