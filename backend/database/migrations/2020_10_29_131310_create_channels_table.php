<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChannelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'channels',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('telegram_id');
                $table->enum('type', ['private', 'group', 'supergroup', 'channel'])->default('channel');
                $table->string('title');
                $table->boolean('only_unique_content')->default(false);
                $table->string('external_link')->nullable();
                $table->uuid('language_id');
                $table->timestamps();

                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
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
        Schema::dropIfExists('channels');
    }
}
