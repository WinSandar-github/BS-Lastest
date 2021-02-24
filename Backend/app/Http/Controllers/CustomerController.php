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
use DB;
use App\tbl_payment_detail;
class CustomerController extends Controller
{
    public function createCustomer(Request $request)
    {
         try{
                $data = json_decode($request->getContent(), true);
                $user=new tbl_customer();
                $user->name=$data["name"];
                $user->code =$data["code"];
                $timestamp = strtotime($data['regDate']);
                $new_date = date("Y-m-d", $timestamp);
                $user->reg_date=$new_date;
                $user->phone =$data["phone"];
                $user->address=$data["address"];
                $user->ip=$data["ip"];
                $user->plan=$data["plan"];
                $user->pon=$data["pon"];
                $user->sn=$data["sn"];
                $user->dn=$data["dn"];
                $user->price=$data["price"];
                $user->desc=$data["desc"];
                $user->save();
               return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
            }catch (\Exception $e) {
                return $e->getMessage();
               // return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
    }
    public function getCustomer(Request $request)
    {
        $customer = tbl_customer::all();
        for($i=0;$i<count($customer);$i++){
            $payment=tbl_payment_detail::where('customer_id','=',$customer[$i]['id'])->get();
            if(!count($payment)){
                $date1=$customer[$i]['reg_date'];
                $date2 = date('Y-m-d');
                $ts1 = strtotime($date1);
                $ts2 = strtotime($date2);
    
                $year1 = date('Y', $ts1);
                $year2 = date('Y', $ts2);
    
                $month1 = date('m', $ts1);
                $month2 = date('m', $ts2);
            
                $diff = (($year2 - $year1) * 12) + ($month2 - $month1);
                $totalMonth=$diff+1;
                $updateCustomer=tbl_customer::find($customer[$i]['id']);
                $updateCustomer->total_price=$totalMonth*$customer[$i]['price'];
                $updateCustomer->save();
            }
        }
        $allCustomer=tbl_customer::all();
        if(sizeof($customer)){
            return response()->json($allCustomer, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
