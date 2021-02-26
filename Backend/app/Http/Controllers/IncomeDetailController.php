<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tbl_income_detail;

class IncomeDetailController extends Controller
{

    public function createIncomeDetail(Request $request)
    {
        try{
            $data=json_decode($request->getContent(), true);
            $income_detail=new tbl_income_detail();
            $income_detail->income_outcome_id=$data['income_id'];
            $date = str_replace('/', '-', $data['income_date']);
            $income_detail->date=date('Y-m-d', strtotime($date));
            $income_detail->reason=$data['income_reason'];
            $income_detail->unit_amount=$data['income_unit_amount'];
            $income_detail->save();
           return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
           return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function getIncomeDetailByIncomeId(Request $request)
    {
        $income_detail = tbl_income_detail::where('income_outcome_id','=',$request->input('income_outcome_id'))->get();
        if(sizeof($income_detail)){
            return response()->json($income_detail, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
             return response()->json(config('common.message.data'), 404,config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }
}
