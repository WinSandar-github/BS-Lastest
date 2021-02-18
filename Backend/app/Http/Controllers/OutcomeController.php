<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tbl_outcome;
use App\tbl_outcome_detail;

class OutcomeController extends Controller
{
    public function getOutcome(Request $request)
    {
        if($request->create_date){
            $outcome = tbl_outcome::whereDate('outcome_date', $request->create_date)->get();
            if(sizeof($outcome)){
                return response()->json($outcome, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
            else{
                return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
        }else{
            $outcome = tbl_outcome::all();
            if(sizeof($outcome)){
                return response()->json($outcome, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
            else{
                return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
        }
            
    }

    public function createOutcome(Request $request)
    {
        try{
            $outcome=new tbl_outcome();
            $outcome->outcome_date=$request->outcome_date;
            $outcome->outcome_total=$request->outcome_total;
            $outcome->save();
           return response()->json($outcome, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function showOutcomeInfo(Request $request)
    {
        $outcome = tbl_outcome::find($request->outcome_id);
         if(empty($outcome)){
            return response()->json(config('common.message.data'), 404,config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
            return response()->json($outcome, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }

    public function updateOutcome(Request $request)
    {
        try{
            $outcome = tbl_outcome::find($request->outcome_id);
		    $outcome->outcome_total=$request->outcome_total;
            $outcome->save();
            return response()->json($outcome, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function deleteOutcome(Request $request)
    {
        $outcome = tbl_outcome::find($request->outcome_id);
        $outcome_detail = tbl_outcome_detail::where('outcome_id','=',$request->outcome_id)->delete();
        if($outcome->delete()){
             return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
