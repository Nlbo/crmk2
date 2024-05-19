<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'contents',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('title');
                $table->text('body');
                $table->integer('order')->default(1);
                $table->uuid('content_chain_id');
                $table->timestamps();

                $table->foreign('content_chain_id')->references('id')->on('content_chains')->onDelete('cascade');
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
        Schema::dropIfExists('contents');
    }
}
