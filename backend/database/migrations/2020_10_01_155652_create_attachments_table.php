<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'attachments',
            function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('file_id');
                $table->uuid('content_id');
                $table->enum(
                    'type',
                    [
                        'Voice',
                        'Photo',
                        'Document',
                        'Video',
                        'VideoNote',
                        'Animation',
                        'Audio'
                    ]
                )->default('Document');
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
        Schema::dropIfExists('attachments');
    }
}
