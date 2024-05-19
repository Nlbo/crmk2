<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChannelTelegramBotTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'channel_telegram_bot',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('channel_id');
                $table->uuid('telegram_bot_id');
                $table->enum('role', ['poster', 'manager']);
                $table->timestamps();

                $table->foreign('channel_id')
                    ->references('id')
                    ->on('channels')
                    ->onDelete('cascade');

                $table->foreign('telegram_bot_id')
                    ->references('id')
                    ->on('telegram_bots')
                    ->onDelete('cascade');
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
        Schema::dropIfExists('channel_telegram_bot');
    }
}
