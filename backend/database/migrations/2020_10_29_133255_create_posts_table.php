<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'posts',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('title');
                $table->text('body')->nullable();
                $table->uuid('language_id');
                $table->uuid('character_id')->nullable();
                $table->uuid('category_id');
                $table->timestamps();

                $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
                $table->foreign('character_id')->references('id')->on('characters')->onDelete('set null');
                $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
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
        Schema::dropIfExists('posts');
    }
}
