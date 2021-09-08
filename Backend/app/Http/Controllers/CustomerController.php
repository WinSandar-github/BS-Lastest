<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\tbl_customer;
use App\tbl_payment_detail;
use Yajra\DataTables\Facades\DataTables;

class CustomerController extends Controller
{
    public function createCustomer(Request $request)
    {
         try{
                $data = json_decode($request->getContent(), true);
                $user=new tbl_customer();
                $user->name=$data["name"];
                $user->code =$data["code"];
                $var = $data['regDate'];
                $date = str_replace('/', '-', $var);
                $user->reg_date=date('Y-m-d', strtotime($date));
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
                return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
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

        $allCustomer=tbl_customer::with(['plan'])->orderBy('id', 'DESC')->get();

        if ( sizeof($customer) ) {
            return $this->customerTable($allCustomer);
        } else {
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function showCustomerInfo(Request $request)
    {
         $customer = tbl_customer::find($request->customerId);
         if(empty($customer)){
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
            return response()->json($customer, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }
    public function updateCustomer(Request $request)
    {
         try{
                $data = json_decode($request->getContent(), true);
                $customer=tbl_customer::find($data['customerId']);
                $customer->name=$data["name"];
                $customer->code =$data["code"];
                $customer->address=$data["address"];
                $customer->ip=$data["ip"];
                $customer->plan=$data["plan"];
                $customer->pon=$data["pon"];
                $customer->sn=$data["sn"];
                $customer->dn=$data["dn"];
                $customer->price=$data["price"];
                $customer->desc=$data["desc"];
                $customer->save();
               return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
            }catch (\Exception $e) {
                return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
    }
    public function deleteCustomer(Request $request)
    {
        $customer = tbl_customer::find($request->customerId);
        if($customer->delete()){
           return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);}
        else{
             return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function getCustomerById(Request $request)
    {
         $customer = tbl_customer::where('id','=',$request->customerId)->with(['plan'])->get();
         if(empty($customer)){
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
            return response()->json($customer, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }
    public function matchId(Request $request)
    {
         $customer = tbl_customer::where('code','=',$request->code)->get();
         if(count($customer)){
            return "1";
         }
         else{
            return "0";
         }
    }

    public function customerTable($data) {
        return Datatables::of($data)
        ->editColumn('reg_date', function($data) {
            $date = date('d/m/Y', strtotime($data['reg_date']));

            return $date;
        })
        ->editColumn('desc', function($data) {
            
        })
        ->editColumn('action', function($data) {
            $edit_btn = "<button type='button' class='btn btn-primary btn-xs' onClick='showCustomerInfo({$data['id']})'>
            <li class='fas fa-edit fa-sm'></li></button>";

            $del_btn = "<button type='button' class='btn btn-danger btn-xs' onClick='deleteCustomer(\"{$data['name']}\", {$data['id']})'>
            <li class='fa fa-trash fa-sm' ></li ></button >";

            return $edit_btn.$del_btn;
        })
        ->addIndexColumn()
        ->toJson();
    }
}
