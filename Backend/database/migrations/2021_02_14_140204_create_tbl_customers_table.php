<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_customer', function (Blueprint $table) {
            $table->id();
            $table->string('name','225');
            $table->string('code','125');
            $table->string('address','225');
            $table->string('ip','125');
            $table->string('plan','225');
            $table->string('pon','225');
            $table->string('sn','225');
            $table->string('dn','225');
            $table->integer('price');
            $table->string('desc','225');
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
        Schema::dropIfExists('tbl_customer');
    }
}
