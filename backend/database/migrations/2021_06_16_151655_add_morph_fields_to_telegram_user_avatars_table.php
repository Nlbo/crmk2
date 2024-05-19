<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMorphFieldsToTelegramUserAvatarsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table(
            'telegram_user_avatars',
            function (Blueprint $table) {
                $table->uuidMorphs('avatarable');
                $table->dropForeign(['telegram_user_id']);
                $table->dropColumn(['telegram_user_id']);
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
        Schema::table(
            'telegram_user_avatars',
            function (Blueprint $table) {
                $table->dropMorphs('avatarable');
                $table->uuid('telegram_user_id');
                $table->foreign('telegram_user_id')->references('id')->on('telegram_users')->onDelete('cascade');
            }
        );
    }
}
