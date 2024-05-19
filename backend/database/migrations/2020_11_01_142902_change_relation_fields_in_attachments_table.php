<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeRelationFieldsInAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table(
            'attachments',
            function (Blueprint $table) {
                $table->dropForeign('attachments_content_id_foreign');
                $table->dropColumn('content_id');
                $table->uuidMorphs('attachable');
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
            'attachments',
            function (Blueprint $table) {
                $table->dropMorphs('attachable');
                $table->uuid('content_id');
                $table->foreign('content_id')->references('id')->on('contents')->onDelete('cascade');
            }
        );
    }
}
