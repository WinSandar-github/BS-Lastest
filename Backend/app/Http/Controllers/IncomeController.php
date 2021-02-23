<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\tbl_income_outcome;
use App\tbl_income_detail;
use App\tbl_outcome_detail;

class IncomeController extends Controller
{
    public function getIncome(Request $request)
    {
        if($request->create_date){
            $income = tbl_income_outcome::whereDate('date', $request->create_date)
                                        ->where('income_total','<>',0)
                                        ->get();
            if(sizeof($income)){
                return response()->json($income, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
            else{
                return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
        }else if($request->monthly=='allmonth'){
                
            $income=DB::table('tbl_income_outcome')
                            ->where('income_total','<>',0)
                            ->select(DB::raw('YEAR(tbl_income_outcome.date) as year'),'tbl_month.month_name as month',DB::raw('count(*) as status'),DB::raw('SUM(tbl_income_outcome.income_total) as income_total'))
                            ->join('tbl_month', function ($join) {
                                $join->where('tbl_month.id','=',DB::raw('MONTH(tbl_income_outcome.date)'));
                                    
                            })
                            ->groupBy(DB::raw('YEAR(tbl_income_outcome.date)'),'tbl_month.month_name')
                            ->get();
                          
            if(sizeof($income)){
                return response()->json($income, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
            else{
                return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
        }else{
             $income = tbl_income_outcome::where('income_total','<>',0)->get();
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
            $income_outcome=tbl_income_outcome::whereDate('date',$request->date)->get();
            if(sizeof($income_outcome)){
                for($i=0;$i<count($income_outcome);$i++){
                    $income=tbl_income_outcome::find($income_outcome[$i]->id);
                    $income->income_total=$request->income_total;
                    $income->save();
                }
            }else{
                $income=new tbl_income_outcome();
                $income->date=$request->date;
                $income->income_total=$request->income_total;
                $income->save();
            }
                    
            return response()->json($income, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return $e->getMessage();

            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function showIncomeInfo(Request $request)
    {
        $income = tbl_income_outcome::find($request->income_id);
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
            $income = tbl_income_outcome::find($request->income_id);
		    $income->income_total=$request->income_total;
            $income->save();
            return response()->json($income, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function deleteIncome(Request $request)
    {
        $income = tbl_income_outcome::find($request->income_id);
        $income_detail = tbl_income_detail::where('income_outcome_id','=',$request->income_id)->delete();
        $outcome_detail = tbl_outcome_detail::where('income_outcome_id','=',$request->income_id)->delete();
        if($income->delete()){
             return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
