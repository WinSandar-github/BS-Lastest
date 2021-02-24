<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tbl_outcome_detail;

class OutcomeDetailController extends Controller
{
    
    public function createOutcomeDetail(Request $request)
    {
        try{
            $data=json_decode($request->getContent(), true);
            $outcome_detail=new tbl_outcome_detail();
            $outcome_detail->income_outcome_id=$data['outcome_id'];
            $outcome_detail->date=$data['outcome_date'];
            $outcome_detail->reason=$data['outcome_reason'];
            $outcome_detail->unit_amount=$data['outcome_unit_amount'];
            $outcome_detail->save();
           return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
           return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function getOutcomeDetailByOutcomeId(Request $request)
    {
        $outcome_detail = tbl_outcome_detail::where('income_outcome_id','=',$request->input('income_outcome_id'))->get();
        if(empty($outcome_detail)){
            return response()->json(config('common.message.data'), 404,config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
             return response()->json($outcome_detail, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }
}
