<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSetWebhookColumnToTelegramBotsTable extends Migration
{
    public function up()
    {
        Schema::table('telegram_bots', function (Blueprint $table) {
            $table->boolean('set_webhook')->default(true);
        });
    }

    public function down()
    {
        Schema::table('telegram_bots', function (Blueprint $table) {
            $table->dropColumn('set_webhook');
        });
    }
}
