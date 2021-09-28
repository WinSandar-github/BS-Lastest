<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\tbl_customer;
use App\tbl_payment_detail;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;

class PaymentDetailMonthly extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payment:monthly'; 

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add New Payment Details Line With Status 0 Monthly In tbl_payment_details';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $customers = tbl_customer::with('initial_payment')->get();

        $curMonth = date('M Y');

        if( count($customers) > 0 ) {
            foreach( $customers as $customer ) {
                $pay_detail = tbl_payment_detail::where([
                   [ 'customer_id', $customer->id ]
                ])->get();

                $checkMonth = $this->checkMonth($pay_detail, $curMonth);

                if ( $checkMonth == 1 ) {
                    $new_payment = new tbl_payment_detail();
                    $new_payment->date = date('Y-m-d');
                    $new_payment->month =  $curMonth;
                    $new_payment->add_charges = 0;
                    $new_payment->customer_id = $customer->id;
                    $new_payment->status = 0;
                    $new_payment->save();
                }
            }
        }

        Log::Info('Monthly Task Run Successfully!');
    }

    public function checkMonth($pay_detail, $curMonth) 
    {
        foreach( $pay_detail as $detail ) {
            if ( !$detail->month == $curMonth ) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}
