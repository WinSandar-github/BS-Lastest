<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('user_roles')->insert([
            [ 'role' => 'Admin' ],
            [ 'role' => 'Receptionist' ],
            [ 'role' => 'Collector' ]
        ]);
    }
}
