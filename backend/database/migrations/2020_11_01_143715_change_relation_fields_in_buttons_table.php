<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeRelationFieldsInButtonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table(
            'buttons',
            function (Blueprint $table) {
                $table->dropForeign('buttons_content_id_foreign');
                $table->dropColumn('content_id');
                $table->uuidMorphs('buttonable');
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
            'buttons',
            function (Blueprint $table) {
                $table->dropMorphs('buttonable');
                $table->uuid('content_id');
                $table->foreign('content_id')->references('id')->on('contents')->onDelete('cascade');
            }
        );
    }
}
