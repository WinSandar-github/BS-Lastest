<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name',125);
            $table->string('email',125)->unique();
            $table->string('password',125);
            $table->string('role',255);
            $table->string('api_key',225);
            $table->timestamps();
        });
    //    Artisan::call('db:seed',[
    //         '--class' => UserSeeder::class
    //  ]); 
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
