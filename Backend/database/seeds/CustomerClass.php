<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerClass extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('customer_classes')->insert([
            [
                'name' => 'VIP'
            ],

            [
                'name' => 'Normal'
            ],

            [
                'name' => 'FOC'
            ]
        ]);
    }
}
