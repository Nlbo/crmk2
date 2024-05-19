<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContentChainsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'content_chains',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('title');
                $table->boolean('is_active')->default(false);
                $table->dateTimeTz('time_from')->nullable();
                $table->dateTimeTz('time_to')->nullable();
                $table->uuid('telegram_bot_id');
                $table->timestamps();

                $table->foreign('telegram_bot_id')->references('id')->on('telegram_bots')->onDelete('cascade');
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
        Schema::dropIfExists('content_chains');
    }
}
