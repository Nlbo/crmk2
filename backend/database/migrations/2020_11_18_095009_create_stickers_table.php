<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStickersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'stickers',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->integer('width');
                $table->integer('height');
                $table->string('emoji');
                $table->string('set_name');
                $table->uuid('sticker_set_id');
                $table->boolean('is_animated');
                $table->string('file_id');
                $table->string('file_unique_id');
                $table->string('file_path');
                $table->integer('file_size');
                $table->uuid('converted_file_id')->nullable();
                $table->timestamps();

                $table->foreign('sticker_set_id')->references('id')->on('sticker_sets')->onDelete('cascade');
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
        Schema::dropIfExists('stickers');
    }
}
