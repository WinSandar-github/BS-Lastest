<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tbl_income;
use App\tbl_income_detail;

class IncomeController extends Controller
{
    public function getIncome(Request $request)
    {
        if($request->create_date){
            $income = tbl_income::whereDate('income_date', $request->create_date)->get();
            if(sizeof($income)){
                return response()->json($income, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
            else{
                return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
        }else{
            $income = tbl_income::all();
            if(sizeof($income)){
                return response()->json($income, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
            else{
                return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
        }
    }

    public function createIncome(Request $request)
    {
        try{
            $income=new tbl_income();
            $income->income_date=$request->income_date;
            $income->income_total=$request->income_total;
            $income->save();
           return response()->json($income, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return $e->getMessage();

            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function showIncomeInfo(Request $request)
    {
        $income = tbl_income::find($request->income_id);
         if(empty($income)){
            return response()->json(config('common.message.data'), 404,config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
            return response()->json($income, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }

    public function updateIncome(Request $request)
    {
        try{
            $income = tbl_income::find($request->income_id);
		    $income->income_total=$request->income_total;
            $income->save();
            return response()->json($income, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function deleteIncome(Request $request)
    {
        $income = tbl_income::find($request->income_id);
        $income_detail = tbl_income_detail::where('income_id','=',$request->income_id)->delete();
        if($income->delete()){
             return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
