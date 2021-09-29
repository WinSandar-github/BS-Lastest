<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\tbl_customer;
use App\tbl_payment_detail;
use App\tbl_income_outcome;
use App\tbl_income_detail;
use Yajra\DataTables\Facades\DataTables; 

class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        try{
            $find_existed = tbl_payment_detail::where([
                ['customer_id', $request->customerId],
                ['month', $request->month],
                ['status', 1]
            ])->first();

            $reg_date = tbl_customer::where('id', $request->customerId)->pluck('reg_date')->first();

            $reg_mY = date('Ym', strtotime($reg_date));
            $cur_mY = date('Ym');
            $pay_mY = $request->year.$this->nameToMonth($request->mth);

            if ( is_object($find_existed) ) {
                if ( $find_existed->status == 1 ) {
                    $text = "Subscription For {$request->month} Was Already Paid";

                }
                else if ($find_existed->status == 0 ) {
                    $text = "Payment Plan For {$request->month} Was Already Created";
                }
                return response()->json($text, 409, config('common.header'), JSON_UNESCAPED_UNICODE);
            } else if ( $pay_mY < $reg_mY ) {
                $date = date('d-m-Y', strtotime($reg_date));

                $text = "Payment Plan Cannot Be Made Before Registration Date ( {$date} )";

                return response()->json($text, 403, config('common.header'), JSON_UNESCAPED_UNICODE);
            } else if ( $pay_mY > $cur_mY) {
                $isExit = tbl_payment_detail::where('customer_id',$request->customerId)
                                            ->where('month',$request->month)
                                            ->get();
                if( count($isExit) > 0 ){
                    $text = "Payment Plan For {$request->month} Was Already Created";

                    return response()->json($text, 403, config('common.header'), JSON_UNESCAPED_UNICODE);
                }
                else{
                    $payment = new tbl_payment_detail();
                    $date = date('Y-m-d');
                    $payment->date = date('Y-m-d');
                    $payment->add_charges = 0;
                    $payment->customer_id = $request->customerId;
                    $payment->month = $request->month;
                    $payment->status = 0;
                    $payment->save();

                    $month = date('M')." ".date('Y');
                    $text = "Payment Plan For ( {$request->month} ) Is Successfully Created. ";

                    return response()->json($text, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
                }
                
                // $date = date('M')." ".date('Y');
                // $text = "Payment Cannot Be Made Over Current Month ( {$date} )";

                // return response()->json($text, 403, config('common.header'), JSON_UNESCAPED_UNICODE);
            } 
            // else {
            //     $payment = new tbl_payment_detail();
            //     $date = date('Y-m-d');
            //     $payment->date = date('Y-m-d');

            //     if($request->addCharges) {
            //         $payment->add_charges = $request->addCharges;
            //     }
            //     else {
            //         $payment->add_charges = 0;
            //     }

            //     $payment->customer_id = $request->customerId;
            //     $payment->month = $request->month;
            //     $payment->save();

            //     $customer=tbl_customer::find($request->customerId);
            //     $date1=$customer->reg_date;
            //     $date2 = date('Y-m-d');
            //     $ts1 = strtotime($date1);
            //     $ts2 = strtotime($date2);
        
            //     $year1 = date('Y', $ts1);
            //     $year2 = date('Y', $ts2);
        
            //     $month1 = date('m', $ts1);
            //     $month2 = date('m', $ts2);
                
            //     $diff = (($year2 - $year1) * 12) + ($month2 - $month1);
            //     $totalMonth=$diff+1;
            //     $paymentDetail=tbl_payment_detail::where('customer_id','=',$request->customerId)->get();
            //     $payMonth=count($paymentDetail);
            //     $customer->total_price=($totalMonth-$payMonth)*$customer->price;
            //     $customer->save();
            //     $income_outcome=tbl_income_outcome::whereDate('date',date('Y-m-d', strtotime($date)))->get();
            //     if(count($income_outcome)){
            //         for($i=0;$i<count($income_outcome);$i++){
            //             $income=tbl_income_outcome::find($income_outcome[$i]->id);
            //             $income->income_total= $income->income_total+$customer->price+$request->addCharges;
            //             $income->save();
            //             $income_detail=new tbl_income_detail();
            //             $income_detail->income_outcome_id=$income->id;
            //             $income_detail->payment_detail_id=$payment->id;
            //             $income_detail->date=date('Y-m-d', strtotime($date));
            //             $income_detail->reason='Adding Payment('.$customer->name.' , '.date('d/m/Y').')';
            //             $income_detail->unit_amount=$customer->price+$request->addCharges;
            //             $income_detail->save();
            //         }
            //     }else{
            //         $income=new tbl_income_outcome();
            //         $income->date=date('Y-m-d', strtotime($date));
            //         $income->income_total=$customer->price+$request->addCharges;
            //         $income->save();
            //         $income_detail=new tbl_income_detail();
            //         $income_detail->income_outcome_id=$income->id;
            //         $income_detail->payment_detail_id=$payment->id;
            //         $income_detail->date=date('Y-m-d', strtotime($date));
            //         $income_detail->reason='Adding Payment('.$customer->name.' , '.date('d/m/Y').')';
            //         $income_detail->unit_amount=$customer->price+$request->addCharges;
            //         $income_detail->save();
            //     }

            //     return response()->json(['payment_detail_id'=>$payment->id], 200,config('common.header'), JSON_UNESCAPED_UNICODE);   
            // }
        }catch (\Exception $e) {
            return $e->getMessage();
           // return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function getPaymentDetail(Request $request)
    {
        $payment = tbl_payment_detail::where('customer_id','=',$request->customerId)
                                    ->join('tbl_customer','tbl_customer.id','tbl_payment_detail.customer_id')
                                    ->get();
        
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

    public function delete_payment_detail(Request $request)
    {
        $payment = tbl_payment_detail::find($request->payment_detail_id);
        $payment->delete();
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
        $income_detail=tbl_income_detail::where('payment_detail_id','=',$request->payment_detail_id)->first();
        
        $income=tbl_income_outcome::where('date',$payment->date)->first();
        $income->income_total= $income->income_total-$customer->price+$payment->addCharges;
        
        if($customer->save() && $income_detail->delete() && $income->save()){
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function getCustomerForPayment(Request $request) {
        $filter = $request->filter;

        if ( $filter == 1 ) {
            $customers = tbl_customer::with(
                'plan.plan_class',
            )
            ->whereHas('payment_detail', function($q) {
                return $q->where('status', '=', 0);
            })
            ->get();

            return $this->customerPaymentTable($customers);
        } else {
            $customers = tbl_customer::with(
                'plan.plan_class',
            )
            ->whereHas('payment_detail', function($q) {
                return $q->where('status', '=', 1);
            })
            ->get();

            return $this->customerPaymentTable($customers);
        }
    }

    public function customerPaymentTable($data) {
        $count = 0;
        return Datatables::of($data)
        ->editColumn('action', function($data) {
            $paymentPage = "<button type='button' onclick='addPayment($data->id)' class='btn btn-info btn-sm'><i class='bi bi-cash-coin bi-lg'></i></button>
                            <button type='button' class='btn btn-success btn-sm' onClick='invoicingPage($data->id)'>
                            <i class='fa fa-calculator fa-lg'></i> </button>
                            <button type='button' class='btn btn-primary btn-sm' onClick='getPaymentDetail($data->id)'>
                            <i class='bi bi-list-check bi-lg'></i></button>";

            return $paymentPage;
        })
        ->addIndexColumn()
        ->toJson();
    }

    public function getCustomerForInvoicing(Request $request)
    {
        $customer = tbl_customer::with('plan.plan_class')->find($request->id);

        $payment = tbl_payment_detail::where([
            ['customer_id', $request->id],
            ['status', 0]
        ])->get();

        $data = [
            'customer' => $customer,
            'payment_left' => $payment
        ];

        return response()->json($data, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
    }

    public function addToInvoice(Request $request)
    {
        $payment_detail = tbl_payment_detail::find($request->id);

        if ( $request->checked == 1 ) {
            $payment_detail->invoice = 1;
            $payment_detail->save();

            $res = $payment_detail->month . ' Is Added To Invoice List!';

            return response()->json($res, 201, config('common.header'), JSON_UNESCAPED_UNICODE);
        } else {
            $payment_detail->invoice = 0;
            $payment_detail->save();

            $res = $payment_detail->month . ' Is Removed From Invoice List!';

            return response()->json($res, 201, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function Billing(Request $request)
    {
        $customer = tbl_customer::with('plan')
        ->whereHas('payment_detail', function($q) {
            return $q->where([
                ['status', '=', 0],
                ['invoice', '=', 1]
            ]);
        })
        ->where('id', '=', $request->id)
        ->first();

        return $customer;
    }

    public function nameToMonth($name) {
        switch($name) {
            case 'Jan': 
                return '01';
                break;
            
            case 'Feb': 
                return '02';
                break;

            case 'Mar': 
                return '03';
                break;

            case 'Apr': 
                return '04';
                break;

            case 'May': 
                return '05';
                break;

            case 'Jun': 
                return '06';
                break;

            case 'Jul': 
                return '07';
                break;

            case 'Aug': 
                return '08';
                break;
            
            case 'Sep': 
                return '09';
                break; 

            case 'Oct': 
                return '10';
                break;

            case 'Nov': 
                return '11';
                break;

            case 'Dec': 
                return '12';
                break;
        }
    } 
}
