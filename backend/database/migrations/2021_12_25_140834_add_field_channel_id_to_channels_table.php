<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldChannelIdToChannelsTable extends Migration
{
    public function up(): void
    {
        Schema::table('channels', static function (Blueprint $table) {
            $table->string('channel_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('channels', static function (Blueprint $table) {
            $table->dropColumn('channel_id');
        });
    }
}
