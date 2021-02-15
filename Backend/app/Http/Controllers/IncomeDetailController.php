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
            $income_detail->income_id=$data['income_id'];
            $date=explode('/',$data['income_date']);
            $income_detail->income_date=$date[2].'-'.$date[1].'-'.$date[0];
            $income_detail->income_reason=$data['income_reason'];
            $income_detail->income_unit_amount=$data['income_unit_amount'];
            $income_detail->save();
           return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
           return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function getIncomeDetailByIncomeId(Request $request)
    {
        $income_detail = tbl_income_detail::where('income_id','=',$request->input('income_id'))->get();
        if(empty($income_detail)){
            return response()->json(config('common.message.data'), 404,config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
             return response()->json($income_detail, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }
}
