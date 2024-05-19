<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTelegramUserAvatarsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'telegram_user_avatars',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('telegram_user_id');
                $table->string('file_id');
                $table->timestamps();

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
        Schema::dropIfExists('telegram_user_avatars');
    }
}
