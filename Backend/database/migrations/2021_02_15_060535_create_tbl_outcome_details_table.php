<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblOutcomeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_outcome_detail', function (Blueprint $table) {
            $table->id();
            $table->date('outcome_date');
            $table->string('outcome_reason',225);
            $table->string('outcome_unit_amount',225);
            $table->bigInteger('outcome_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbl_outcome_details');
    }
}
