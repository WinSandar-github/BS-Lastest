<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\tbl_income_outcome;
use App\tbl_outcome_detail;
use App\tbl_income_detail;
use Yajra\DataTables\Facades\DataTables; 

class OutcomeController extends Controller
{
    public function getOutcome(Request $request)
    {
        if($request->create_date){

            $time = str_replace('/', '-', $request->create_date);
            $time = strtotime($time);
            $date = date('Y-m-d', $time);

            $outcome = tbl_income_outcome::whereDate('date',  $date)
                                            ->where('outcome_total','<>',0)
                                            ->get();
            if(sizeof($outcome)){
                return response()->json($outcome, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
            else{
                return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
        }else if($request->monthly=='allmonth'){

            $outcome=DB::table('tbl_income_outcome')
                        ->where('outcome_total','<>',0)
                        ->select(DB::raw('YEAR(tbl_income_outcome.date) as year'),'tbl_month.month_name as month',DB::raw('count(*) as status'),DB::raw('SUM(tbl_income_outcome.outcome_total) as outcome_total'))
                        ->join('tbl_month', function ($join) {
                            $join->where('tbl_month.id','=',DB::raw('MONTH(tbl_income_outcome.date)'));

                        })
                        ->groupBy(DB::raw('YEAR(tbl_income_outcome.date)'),'tbl_month.month_name')
                        ->get();

            if(sizeof($outcome)){
                return response()->json($outcome, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
            else{
                return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
        }else{

            $outcome = tbl_income_outcome::where('outcome_total','<>',0)->get();
            
            return $this->outcomeTable($outcome);
            
        }

    }

    public function outcomeTable($data)
    {
        return Datatables::of($data)
        ->editColumn('date', function($data) {
            $time = strtotime($data->date);
            $dt = date('d/m/Y', $time);

            return $dt;
        })
        ->editColumn('action', function($data) {
            $add = "<div class='btn-group'><button type='button' class='btn btn-primary btn-sm' onClick='addOutcomeDetailInfo({$data->id})'>
            <li class='fa fa-hand-holding-usd fa-lg'></li></button>";

            $del = "<button type='button' class='btn btn-danger btn-sm' onClick=deleteOutcome(\"{$data->date}\",{$data->id})>
            <li class='fa fa-trash fa-lg' ></li ></button ></div ></td > ";

            return $add.$del;
        })
        ->rawColumns([
            'date',
            'action'
        ])
        ->make();
    }

    public function createOutcome(Request $request)
    {
        try{
            $date = str_replace('/', '-', $request->date);
            $income_outcome=tbl_income_outcome::whereDate('date',date('Y-m-d', strtotime($date)))->get();
            if(sizeof($income_outcome)){
                for($i=0;$i<count($income_outcome);$i++){
                    $outcome=tbl_income_outcome::find($income_outcome[$i]->id);
                    $outcome->outcome_total=$request->outcome_total;
                    $outcome->save();
                }

            }else{
                $outcome=new tbl_income_outcome();
                $outcome->date=date('Y-m-d', strtotime($date));
                $outcome->outcome_total=$request->outcome_total;
                $outcome->save();
            }
            return response()->json($outcome, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function showOutcomeInfo(Request $request)
    {
        $outcome = tbl_income_outcome::find($request->outcome_id);
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
            $outcome = tbl_income_outcome::find($request->outcome_id);
		    $outcome->outcome_total=$request->outcome_total;
            $outcome->save();
            return response()->json($outcome, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function deleteOutcome(Request $request)
    {
        $outcome = tbl_income_outcome::find($request->outcome_id);
        $outcome_detail = tbl_outcome_detail::where('income_outcome_id','=',$request->outcome_id)->delete();
        $income_detail = tbl_income_detail::where('income_outcome_id','=',$request->income_id)->delete();
        if($outcome->delete()){
             return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
