<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tbl_invoice;
use App\tbl_invoice_detail;
use App\tbl_customer;
use App\tbl_income_outcome;
use App\tbl_income_detail;
use App\tbl_outcome_detail;
use App\tbl_payment_detail;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function createInvoice(Request $request)
    {
        try{
            $req_data = json_decode($request->getContent(), true);
            $invoices = $req_data[4];
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
            $invoice->user_id = $req_data[3];
            $invoice->save();

            $invoice->invoice_no = "INV-" . $invoice->id;
            $invoice->save();
            
            $invoice_detail = new tbl_invoice_detail();
            $invoice_detail->invoice_id = $invoice->id;
            $invoice_detail->desc = json_encode($req_data[4]) ;
            $invoice_detail->save();
           
            $customer = tbl_customer::find($req_data[2]);
            $date = date('Y-m-d');

            $income_outcome = tbl_income_outcome::whereDate('date',date('Y-m-d', strtotime($date)))->get();
            
            if (count($income_outcome)){

                for($i=0;$i<count($income_outcome);$i++){

                    $income = tbl_income_outcome::find($income_outcome[$i]->id);
                    $income->income_total = $income->income_total + $req_data[1] ;
                    $income->save();

                    $income_detail = new tbl_income_detail();
                    $income_detail->income_outcome_id = $income->id;
                    $income_detail->invoice_id = $invoice->id;
                    $income_detail->date = date('Y-m-d', strtotime($date));
                    $income_detail->reason = 'Adding Payment('.$customer->name.' , '.date('d/m/Y').')';
                    $income_detail->unit_amount = $req_data[1];
                    $income_detail->save();

                }

            } else {

                $income = new tbl_income_outcome();
                $income->date = date('Y-m-d', strtotime($date));
                $income->income_total = $req_data[1];
                $income->save();

                $income_detail = new tbl_income_detail();
                $income_detail->income_outcome_id = $income->id;
                $income_detail->invoice_id = $invoice->id;
                $income_detail->date = date('Y-m-d', strtotime($date));
                $income_detail->reason = 'Adding Payment('.$customer->name.' , '.date('d/m/Y').')';
                $income_detail->unit_amount =$req_data[1];
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
            $approved =  DB::select("SELECT tbl_customer.name as customer_name , 
                                            tbl_invoices.invoice_no,
                                            tbl_invoices.total,tbl_invoices.id,
                                            users.name as collector_name
                                    FROM  tbl_customer , tbl_invoices , users
                                    Where tbl_customer.id = '$request->id'
                                    AND tbl_customer.id =  tbl_invoices.customer_id
                                    AND tbl_invoices.user_id =  users.id
                                    AND tbl_invoices.cancel = 0");

            $cancelled =  DB::select("SELECT tbl_customer.name as customer_name , 
                                        tbl_invoices.invoice_no,
                                        tbl_invoices.total,tbl_invoices.id,
                                        users.name as collector_name
                                    FROM  tbl_customer , tbl_invoices , users
                                    Where tbl_customer.id = '$request->id'
                                    AND tbl_customer.id =  tbl_invoices.customer_id
                                    AND tbl_invoices.user_id =  users.id
                                    AND tbl_invoices.cancel = 1");

            $cus_name = tbl_customer::where('id', $request->id)->pluck('name')->first();

            if ( $request->filter == 0 ) {
                return response()->json(
                    ['data' => $approved, 'name' => $cus_name ],
                    200,
                    config('common.header'), 
                    JSON_UNESCAPED_UNICODE
                );  
            } else {
                return response()->json(
                    ['data' => $cancelled, 'name' => $cus_name ],
                    200,
                    config('common.header'), 
                    JSON_UNESCAPED_UNICODE
                );
            }
   
        }catch (\Exception $e) {
           return response()->json($e->getMessage(), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function showInvoice(Request $request)
    {
        try{
            $invoices =  DB::select("SELECT *
                                    FROM  tbl_invoices, tbl_invoice_details
                                    Where tbl_invoices.id = '$request->id'
                                    AND tbl_invoice_details.invoice_id =  tbl_invoices.id");


            return response()->json($invoices, 200,config('common.header'), JSON_UNESCAPED_UNICODE);   
   
        }catch (\Exception $e) {
            return $e->getMessage();
           // return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function updateInvoice(Request $request)
    {
        try{
            $req_data = json_decode($request->getContent(), true);
            
            $invoice_detail = tbl_invoice_detail::where('invoice_id',$req_data[2])->first();

            $old_invoice = json_decode($invoice_detail->desc);

            $old_total = 0;

            for($i = 0; $i < count($old_invoice); $i++){

                // $old_total = $old_total + (int) $old_invoice[$i]->price ;

                $payment_plan = tbl_payment_detail::find($old_invoice[$i]->id);

                $payment_plan->status = 0;

                $payment_plan->save();
            }

            $invoice = tbl_invoice::find($req_data[2]);

            $old_total = $invoice->total ;

            $invoice->total = $req_data[1];
            $invoice->add_charges = $req_data[0];
            $invoice->save();
            
            $invoice_detail->desc = json_encode($req_data[4]) ;
            $invoice_detail->save();

            $invoices = $req_data[4];

            for($j=0; $j<count($invoices); $j++){

                $payment_detail = tbl_payment_detail::where('customer_id', $req_data[3])
                                                     ->where('month',$invoices[$j]['month'])
                                                     ->first();
                                                               
                $payment_detail->status = 1;
                
                $payment_detail->save();

            }
           
            $income_detail = tbl_income_detail::where('invoice_id',$req_data[2])->first();
            $income_detail->unit_amount = ($income_detail->unit_amount - $old_total) + ($req_data[1]);
            $income_detail->save();

            $income = tbl_income_outcome::find($income_detail->income_outcome_id);
            $income->income_total = ( $income->income_total  - $old_total ) + $req_data[1] ;
            $income->save();

            return response()->json(['customer_id'=>$req_data[3]], 200,config('common.header'), JSON_UNESCAPED_UNICODE);   
   
        }catch (\Exception $e) {
            return $e->getMessage();
           // return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    
    
    public function delInvoiceHistory(Request $request)
    {
        $details = tbl_invoice_detail::where('invoice_id', $request->id)->get();

        if ( count($details) > 0 ) {
            $exception = DB::transaction( function() use($request) {

                // Change Cancel Status in Invoice Table //
                $invoice = tbl_invoice::find($request->id);
                $invoice->user_id = $request->user_id;
                $invoice->cancel = 1;
                $invoice->save();

                // Check tbl_income_outcome record by current date //
                $in_out = tbl_income_outcome::where('date', date('Y-m-d'))->first();

                // Modify tbl_income_outcome with pre written function within this class //
                // Not Sure If DB::transaction Will Affect This Function If Thrown Exception //
                $in_out_id = $this->modifyIncomeOutcome($in_out, $invoice);

                // Add Record To tbl_outcome_detail Table //
                $outcome = new tbl_outcome_detail();
                $outcome->date = date('Y-m-d');
                $outcome->reason = "Cancelled Invoice - {$invoice->invoice_no}";
                $outcome->unit_amount = $invoice->total;
                $outcome->income_outcome_id = $in_out_id;
                $outcome->save();

                // Get Invoice Details From tbl_invoice_detail //
                $payment_details = json_decode(
                    tbl_invoice_detail::where('invoice_id', $request->id)->pluck('desc')->first(),
                    true
                );

                if ( count($payment_details) > 0 ) {
                    foreach( $payment_details as $pay ) {
                        // Update value of 'status' and 'invoice' fields //
                        $payment = tbl_payment_detail::find($pay['id']);
                        $payment->status = 0;
                        $payment->invoice = 0;
                        $payment->save();
                    }
                }
            });

            if ( is_null($exception) ) {
                return response()->json("{$request->inv} History is Cancelled Successfully!", 201, config('common.header'), JSON_UNESCAPED_UNICODE);
            } else {
                return response()->json($exception, 500, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
        }
    }

    public function modifyIncomeOutcome($in_out, $invoice)
    {
        if ( !is_null($in_out) ) {
            $in_out->date = date('Y-m-d');
            $in_out->outcome_total = (float)$in_out->outcome_total + (float)$invoice->total;
            $in_out->save();

            return $in_out->id;
        } else {
            $txn = new tbl_income_outcome();
            $txn->date = date('Y-m-d');
            $txn->income_total = 0;
            $txn->outcome_total = $invoice->total;
            $txn->save();

            return $txn->id;
        }
    }
}
