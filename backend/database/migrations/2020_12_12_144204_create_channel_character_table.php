<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChannelCharacterTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'channel_character',
            function (Blueprint $table) {
                $table->id();
                $table->uuid('channel_id');
                $table->uuid('character_id');
                $table->timestamps();

                $table->foreign('channel_id')->references('id')->on('channels')->onDelete('cascade');
                $table->foreign('character_id')->references('id')->on('characters')->onDelete('cascade');
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
        Schema::dropIfExists('character_channel');
    }
}
