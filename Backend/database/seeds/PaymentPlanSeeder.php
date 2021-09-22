<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\tbl_payment_plan;

class PaymentPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $payment_plan = [
            [
                'month' => 1
            ],
            [
                'month' => 3
            ],
            [
                'month' => 6
            ]
            
        ];
        foreach($payment_plan as $plan){
            tbl_payment_plan::create($plan);
        }
    }
}
