<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeForeignKeysHooksOnPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table(
            'posts',
            function (Blueprint $table) {
                $table->dropForeign(['language_id']);
                $table->dropForeign(['category_id']);
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('no action');
                $table->foreign('category_id')->references('id')->on('categories')->onDelete('no action');
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
            'posts',
            function (Blueprint $table) {
                $table->dropForeign(['language_id']);
                $table->dropForeign(['category_id']);
                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
                $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            }
        );
    }
}
