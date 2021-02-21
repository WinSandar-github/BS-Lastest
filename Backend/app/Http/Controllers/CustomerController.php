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
        if(sizeof($customer)){
            return response()->json($customer, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
