<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\tbl_customer;
use App\tbl_payment_detail;
use App\tbl_income_outcome;
use App\tbl_income_detail;
class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        try{
            $payment=new tbl_payment_detail();
            $date=date('Y-m-d');
            $payment->date=date('Y-m-d');
            $payment->add_charges=$request->addCharges;
            $payment->customer_id=$request->customerId;
            $payment->month=$request->month;
            $payment->save();
            $customer=tbl_customer::find($request->customerId);
            $date1=$customer->reg_date;
            $date2 = date('Y-m-d');
            $ts1 = strtotime($date1);
            $ts2 = strtotime($date2);
    
            $year1 = date('Y', $ts1);
            $year2 = date('Y', $ts2);
    
            $month1 = date('m', $ts1);
            $month2 = date('m', $ts2);
            
            $diff = (($year2 - $year1) * 12) + ($month2 - $month1);
            $totalMonth=$diff+1;
            $paymentDetail=tbl_payment_detail::where('customer_id','=',$request->customerId)->get();
            $payMonth=count($paymentDetail);
            $customer->total_price=($totalMonth-$payMonth)*$customer->price;
            $customer->save();
            $income_outcome=tbl_income_outcome::whereDate('date',date('Y-m-d', strtotime($date)))->get();
            if(count($income_outcome)){
                for($i=0;$i<count($income_outcome);$i++){
                    $income=tbl_income_outcome::find($income_outcome[$i]->id);
                    $income->income_total= $income->income_total+$customer->price+$request->addCharges;
                    $income->save();
                    $income_detail=new tbl_income_detail();
                    $income_detail->income_outcome_id=$income->id;
                    $income_detail->date=date('Y-m-d', strtotime($date));
                    $income_detail->reason='Adding Payment';
                    $income_detail->unit_amount=$customer->price+$request->addCharges;
                    $income_detail->save();
                }
            }else{
                $income=new tbl_income_outcome();
                $income->date=date('Y-m-d', strtotime($date));
                $income->income_total=$customer->price+$request->addCharges;
                $income->save();
                $income_detail=new tbl_income_detail();
                $income_detail->income_outcome_id=$income->id;
                $income_detail->date=date('Y-m-d', strtotime($date));
                $income_detail->reason='Adding Payment';
                $income_detail->unit_amount=$customer->price+$request->addCharges;
                $income_detail->save();
            }

           return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return $e->getMessage();
           // return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function getPaymentDetail(Request $request)
    {
        $payment = tbl_payment_detail::where('customer_id','=',$request->customerId)->get();
        
        if(count($payment)){
            return response()->json($payment, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function getPaymentDetailBypaymentId(Request $request)
    {
        $payment = tbl_payment_detail::where('id','=',$request->paymentId)->get();
        
        if(count($payment)){
            return response()->json($payment, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

}
