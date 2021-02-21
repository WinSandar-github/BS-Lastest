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

class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        try{
            $payment=new tbl_payment_detail();
            $timestamp = strtotime($request->payDate);
            $new_date = date("Y-m-d", $timestamp);
            $payment->date=$new_date;
            $payment->add_charges=$request->addCharges;
            $payment->customer_id=$request->customerId;
            $payment->save();
           return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

}
