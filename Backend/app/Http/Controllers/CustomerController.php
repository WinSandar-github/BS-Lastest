<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\tbl_customer;
use App\tbl_payment_detail;
use App\customerClass;
use App\tbl_payment_plan;
use Yajra\DataTables\Facades\DataTables;

class CustomerController extends Controller
{
    public function createCustomer(Request $request)
    {
         try{
                $data = json_decode($request->getContent(), true);
                $user = new tbl_customer();
                $user->name = $data["name"];
                $user->code = $data["code"];
                $var = $data['regDate'];
                $date = str_replace('/', '-', $var);
                $user->reg_date = date('Y-m-d', strtotime($date));
                $user->phone = $data["phone"];
                $user->address = $data["address"];
                $user->ip = $data["ip"];
                $user->plan = $data["plan"];
                $user->payment_plan_id = $data["initial_payment"];
                $user->pon = $data["pon"];
                $user->sn = $data["sn"];
                $user->dn = $data["dn"];
                $user->price = $data["price"];
                $user->desc = $data["desc"];
                $user->save();
                $plan_month = tbl_payment_plan::find($data['initial_payment']);
                for($i = 0; $i < $plan_month->month; $i++){
                    $add_month = ' +' . $i . ' month' ;
                    $payment = tbl_payment_detail::create([
                        'date' => date('Y-m-d'),
                        'month' => $i > 0 ? date('M Y', strtotime(date('Y-m-d'). $add_month)) : date('M Y') ,
                        'add_charges' => 0 ,
                        'customer_id' => $user->id,
                        'status' => 0
                    ]);
                }
                return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
            }catch (\Exception $e) {
                return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
    }

    public function getCustomer(Request $request)
    {
        $customer = tbl_customer::all();

        for($i=0;$i<count($customer);$i++){
            $payment = tbl_payment_detail::where('customer_id','=',$customer[$i]['id'])->get();
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
                $totalMonth = $diff+1;
                $updateCustomer = tbl_customer::find($customer[$i]['id']);
                $updateCustomer->total_price = $totalMonth*$customer[$i]['price'];
                $updateCustomer->save();
            }
        }

        $allCustomer = tbl_customer::with(['plan.plan_class','initial_payment'])->orderBy('id', 'DESC')->get();

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
                $customer->customer_class = $data['customer_class'];
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
        // ->editColumn('plan_class', function($data) {
        //     $json = json_decode($data, true);

        //     return $json['plan']['name'].' '.$json['plan']['plan_class']['name'];
        // })
        ->editColumn('reg_date', function($data) {
            $date = date('d/m/Y', strtotime($data['reg_date']));

            return $date;
        })
        ->editColumn('desc', function($data) {
            if ( $data['desc'] !== "" ) {
                $str_explode = explode(' ', $data['desc']);

                $twoWords = $str_explode[0].' '.$str_explode[1];

                $elem = "<p id='toolip' data-toggle='tooltip' title=\"{$data['desc']}\">$twoWords</p>";

                return $elem;
            }
        })
        ->editColumn('action', function($data) {
            $edit_btn = "<button type='button' class='btn btn-primary btn-xs' onClick='showCustomerInfo({$data['id']})'>
            <li class='fas fa-edit fa-sm'></li></button>";

            $del_btn = "<button type='button' class='btn btn-danger btn-xs' onClick='deleteCustomer(\"{$data['name']}\", {$data['id']})'>
            <li class='fa fa-trash fa-sm' ></li ></button >";

            return $edit_btn.$del_btn;
        })
        ->rawColumns([
            // 'plan_class',
            'reg_date',
            'desc',
            'action'
        ])
        ->addIndexColumn()
        ->make();
    }

    public function getCustomerClass() {
        try 
        {
            $data = customerClass::all();

            return response()->json($data, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        } catch( \Exception $e ) {
            return response()->json('something went wrong', 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function get_initital_payment_month() {
        try 
        {
            $data = tbl_payment_plan::all();

            return response()->json($data, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        } catch( \Exception $e ) {
            return response()->json('something went wrong', 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
