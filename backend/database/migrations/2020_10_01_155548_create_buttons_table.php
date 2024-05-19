<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateButtonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'buttons',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('text');
                $table->string('url');
                $table->uuid('content_id');
                $table->timestamps();

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
        Schema::dropIfExists('buttons');
    }
}
