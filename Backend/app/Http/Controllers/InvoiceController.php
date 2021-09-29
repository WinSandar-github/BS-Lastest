<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tbl_invoice;
use App\tbl_invoice_detail;
use App\tbl_customer;
use App\tbl_income_outcome;
use App\tbl_income_detail;
use App\tbl_payment_detail;
use DB;

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
   
        }catch (\Exception $e) {
            return $e->getMessage();
           // return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function getPaymentInvoice(Request $request)
    {
        try{
            
            $invoice = tbl_invoice::find($request->id);

            $customer =  DB::select("SELECT tbl_customer.name as customer_name , tbl_plan.name as plan_name,
                                        customer_classes.name as class ,tbl_customer.address , tbl_customer.code,
                                        tbl_customer.pon, tbl_customer.sn, tbl_customer.dn ,tbl_plan.price ,
                                        tbl_invoices.add_charges, tbl_invoices.total
                                        FROM  tbl_customer , tbl_plan , customer_classes , tbl_invoices
                                        Where tbl_customer.plan = tbl_plan.id 
                                        AND customer_classes.id = tbl_plan.class
                                        AND tbl_customer.id = tbl_invoices.customer_id
                                        AND tbl_customer.id = '$invoice->customer_id'
                                        AND tbl_invoices.id = '$invoice->id'");

            $invoic_detail =  DB::select("SELECT *
                                        FROM  tbl_invoice_details , tbl_invoices
                                        Where tbl_invoices.id = tbl_invoice_details.invoice_id
                                        AND tbl_invoice_details.invoice_id = '$request->id'");

            return response()->json(['customer'=> $customer,'invoice_detail'=> $invoic_detail ], 200,config('common.header'), JSON_UNESCAPED_UNICODE);   
   
        }catch (\Exception $e) {
            return $e->getMessage();
           // return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    
    public function getAllInvoices(Request $request)
    {
        try{
            $invoices =  DB::select("SELECT *
                                        FROM  tbl_customer , tbl_invoices
                                        Where tbl_customer.id = '$request->id'
                                        AND tbl_customer.id =  tbl_invoices.customer_id");

            // $invoices = tbl_invoice::where('customer_id',$request->id)->get();

            return response()->json($invoices, 200,config('common.header'), JSON_UNESCAPED_UNICODE);   
   
        }catch (\Exception $e) {
            return $e->getMessage();
           // return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    

}