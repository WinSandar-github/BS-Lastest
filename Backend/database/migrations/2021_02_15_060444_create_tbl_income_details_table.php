<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblIncomeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_income_detail', function (Blueprint $table) {
            $table->id();
            $table->date('income_date');
            $table->string('income_reason',225);
            $table->string('income_unit_amount',225);
            $table->bigInteger('income_id');
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
        Schema::dropIfExists('tbl_income_details');
    }
}
