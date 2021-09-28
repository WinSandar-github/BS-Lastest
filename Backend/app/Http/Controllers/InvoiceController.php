<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tbl_invoice;
use App\tbl_invoice_detail;
use App\tbl_customer;
use App\tbl_income_outcome;
use App\tbl_income_detail;
use App\tbl_payment_detail;

class InvoiceController extends Controller
{
    public function createInvoice(Request $request)
    {
        try{
            $req_data = json_decode($request->getContent(), true);
            $invoices = $req_data[3];
            for($j=0; $j<count($invoices); $j++){
                $payment_detail = tbl_payment_detail::where('customer_id', $req_data[2])
                                                     ->where('month',$invoices[$j]['month'])
                                                     ->first();
                $payment_detail->status = 1;
                $payment_detail->save();
            }
            

            $invoice = new tbl_invoice();
            $invoice->customer_id = $req_data[2];
            $invoice->total = $req_data[1];
            $invoice->add_charges = $req_data[0];
            $invoice->save();

            $invoice->invoice_no = "INV-" . $invoice->id;
            $invoice->save();
            
            $invoice_detail = new tbl_invoice_detail();
            $invoice_detail->invoice_id = $invoice->id;
            $invoice_detail->desc = json_encode($req_data[3]) ;
            $invoice_detail->save();
           
            $customer = tbl_customer::find($req_data[2]);
            $date = date('Y-m-d');

            $income_outcome = tbl_income_outcome::whereDate('date',date('Y-m-d', strtotime($date)))->get();
            
            if (count($income_outcome)){

                for($i=0;$i<count($income_outcome);$i++){

                    $income = tbl_income_outcome::find($income_outcome[$i]->id);
                    $income->income_total = $income->income_total + $req_data[1] + $req_data[0];
                    $income->save();

                    $income_detail = new tbl_income_detail();
                    $income_detail->income_outcome_id = $income->id;
                    $income_detail->invoice_id = $invoice->id;
                    $income_detail->date = date('Y-m-d', strtotime($date));
                    $income_detail->reason = 'Adding Payment('.$customer->name.' , '.date('d/m/Y').')';
                    $income_detail->unit_amount = $req_data[1] + $req_data[0];
                    $income_detail->save();

                }

            } else {

                $income = new tbl_income_outcome();
                $income->date = date('Y-m-d', strtotime($date));
                $income->income_total = $req_data[1] + $req_data[0];
                $income->save();

                $income_detail = new tbl_income_detail();
                $income_detail->income_outcome_id = $income->id;
                $income_detail->invoice_id = $invoice->id;
                $income_detail->date = date('Y-m-d', strtotime($date));
                $income_detail->reason = 'Adding Payment('.$customer->name.' , '.date('d/m/Y').')';
                $income_detail->unit_amount =$req_data[1] + $req_data[0];
                $income_detail->save();

            }

            return response()->json(['invoice_id'=>$invoice->id], 200,config('common.header'), JSON_UNESCAPED_UNICODE);   

            // $payment = new tbl_payment_detail();
            // $date = date('Y-m-d');
            // $payment->date = date('Y-m-d');

            // if($req_data[0]) {
            //     $payment->add_charges = $req_data[0];
            // }
            // else {
            //     $payment->add_charges = 0;
            // }

            // $payment->customer_id = $request->customerId;
            // $payment->month = $req_data[0];
            // $payment->save();

            // $customer=tbl_customer::find($request->customerId);
            // $date1=$customer->reg_date;
            // $date2 = date('Y-m-d');
            // $ts1 = strtotime($date1);
            // $ts2 = strtotime($date2);
    
            // $year1 = date('Y', $ts1);
            // $year2 = date('Y', $ts2);
    
            // $month1 = date('m', $ts1);
            // $month2 = date('m', $ts2);
            
            // $diff = (($year2 - $year1) * 12) + ($month2 - $month1);
            // $totalMonth=$diff+1;
            // $paymentDetail=tbl_payment_detail::where('customer_id','=',$request->customerId)->get();
            // $payMonth=count($paymentDetail);
            // $customer->total_price=($totalMonth-$payMonth)*$customer->price;
            // $customer->save();
            // $income_outcome=tbl_income_outcome::whereDate('date',date('Y-m-d', strtotime($date)))->get();
            // if(count($income_outcome)){
            //     for($i=0;$i<count($income_outcome);$i++){
            //         $income=tbl_income_outcome::find($income_outcome[$i]->id);
            //         $income->income_total= $income->income_total+$customer->price+$request->addCharges;
            //         $income->save();
            //         $income_detail=new tbl_income_detail();
            //         $income_detail->income_outcome_id=$income->id;
            //         $income_detail->payment_detail_id=$payment->id;
            //         $income_detail->date=date('Y-m-d', strtotime($date));
            //         $income_detail->reason='Adding Payment('.$customer->name.' , '.date('d/m/Y').')';
            //         $income_detail->unit_amount=$customer->price+$request->addCharges;
            //         $income_detail->save();
            //     }
            // }else{
            //     $income=new tbl_income_outcome();
            //     $income->date=date('Y-m-d', strtotime($date));
            //     $income->income_total=$customer->price+$request->addCharges;
            //     $income->save();
            //     $income_detail=new tbl_income_detail();
            //     $income_detail->income_outcome_id=$income->id;
            //     $income_detail->payment_detail_id=$payment->id;
            //     $income_detail->date=date('Y-m-d', strtotime($date));
            //     $income_detail->reason='Adding Payment('.$customer->name.' , '.date('d/m/Y').')';
            //     $income_detail->unit_amount=$customer->price+$request->addCharges;
            //     $income_detail->save();
            // }

            // return response()->json(['payment_detail_id'=>$payment->id], 200,config('common.header'), JSON_UNESCAPED_UNICODE);   
            
        }catch (\Exception $e) {
            return $e->getMessage();
           // return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
