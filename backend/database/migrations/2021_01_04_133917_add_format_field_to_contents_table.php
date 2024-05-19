<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFormatFieldToContentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table(
            'contents',
            function (Blueprint $table) {
                $table->enum('format', ['HTML', 'MarkdownV2'])->nullable();
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
        Schema::table(
            'contents',
            function (Blueprint $table) {
                $table->dropColumn('format');
            }
        );
    }
}