<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSendIntervalFieldToContentChainsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table(
            'content_chains',
            function (Blueprint $table) {
                $table->string('send_interval')->default('1 hour');
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
            'content_chains',
            function (Blueprint $table) {
                $table->dropColumn('send_interval');
            }
        );
    }
}
