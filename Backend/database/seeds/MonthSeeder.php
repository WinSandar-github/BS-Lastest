<?php

use Illuminate\Database\Seeder;
use App\tbl_month;

class MonthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $months = [
            ['id' => 1, 'month_name' => 'January'],
            ['id' => 2, 'month_name' => 'February'],
            ['id' => 3, 'month_name' => 'March'],
            ['id' => 4, 'month_name' => 'April'],
            ['id' => 5, 'month_name' => 'May'],
            ['id' => 6, 'month_name' => 'June'],
            ['id' => 7, 'month_name' => 'July'],
            ['id' => 8, 'month_name' => 'August'],
            ['id' => 9, 'month_name' => 'September'],
            ['id' => 10, 'month_name' => 'October'],
            ['id' => 11, 'month_name' => 'November'],
            ['id' => 12, 'month_name' => 'December'],
        ];
        foreach($months as $month){
            tbl_month::create($month);
        }
    }
}
