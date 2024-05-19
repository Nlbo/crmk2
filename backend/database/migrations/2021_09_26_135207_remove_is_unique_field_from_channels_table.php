<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveIsUniqueFieldFromChannelsTable extends Migration
{
    public function up()
    {
        Schema::table('channels', function (Blueprint $table) {
            $table->dropColumn('only_unique_content');
        });
    }

    public function down()
    {
        Schema::table('channels', function (Blueprint $table) {
            $table->boolean('only_unique_content')->default(false);
        });
    }
}
