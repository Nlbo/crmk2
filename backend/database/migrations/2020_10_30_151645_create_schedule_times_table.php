<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScheduleTimesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'schedule_times',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->dateTimeTz('time');
                $table->uuid('post_id')->nullable();
                $table->uuid('channel_id');
                $table->uuid('category_id');
                $table->integer('status_code')->nullable();
                $table->enum('status', ['System error', 'No post', 'Telegram error', 'Success'])->nullable();
                $table->timestamps();

                $table->foreign('channel_id')
                    ->references('id')
                    ->on('channels')
                    ->onDelete('cascade');

                $table->foreign('post_id')
                    ->references('id')
                    ->on('posts')
                    ->onDelete('cascade');

                $table->foreign('category_id')
                    ->references('id')
                    ->on('categories')
                    ->onDelete('cascade');
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
        Schema::dropIfExists('schedule_times');
    }
}
