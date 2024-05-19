<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessageHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'message_histories',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('telegram_user_id');
                $table->uuid('content_chain_id');
                $table->uuid('content_id');
                $table->dateTime('delay')->nullable();
                $table->boolean('is_send')->default(false);
                $table->timestamps();

                $table->foreign('telegram_user_id')->references('id')->on('telegram_users')->onDelete('cascade');
                $table->foreign('content_chain_id')->references('id')->on('content_chains')->onDelete('cascade');
                $table->foreign('content_id')->references('id')->on('contents')->onDelete('cascade');
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
        Schema::dropIfExists('message_histories');
    }
}
