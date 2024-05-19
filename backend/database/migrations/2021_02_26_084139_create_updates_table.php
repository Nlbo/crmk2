<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUpdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'updates',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->bigInteger('original_id')->nullable();
                $table->string('media_group_id')->nullable();
                $table->uuid('chat_id');
                $table->unsignedBigInteger('user_id')->nullable();
                $table->uuidMorphs('from');
                $table->uuidMorphs('to');
                $table->uuid('sticker_id')->nullable();
                $table->uuid('reply_to')->nullable();

                $table->text('text')->nullable();

                $table->json('original');

                $table->timestamp('date');
                $table->timestamp('edit_date')->nullable();
                $table->timestamps();


                $table->foreign('chat_id')->references('id')->on('chats');
                $table->foreign('sticker_id')->references('id')->on('stickers');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
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
        Schema::dropIfExists('updates');
    }
}
