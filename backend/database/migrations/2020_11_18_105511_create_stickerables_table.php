<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStickerablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'stickerables',
            function (Blueprint $table) {
                $table->id();
                $table->uuid('sticker_id');
                $table->string('stickerable_id');
                $table->string('stickerable_type');
                $table->timestamps();

                $table->foreign('sticker_id')->references('id')->on('stickers')->onDelete('cascade');
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
        Schema::dropIfExists('stickerables');
    }
}
