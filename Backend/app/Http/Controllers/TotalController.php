<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\tbl_income_outcome;
use Yajra\DataTables\Facades\DataTables; 

class TotalController extends Controller
{
    public function getTotal(Request $request)
    {
        $start_date = $request->start_date == null ? '' : date('Y-m-d', strtotime(str_replace('/','-', $request->start_date))) ;
        $end_date = $request->end_date == null ? '' : date('Y-m-d', strtotime(str_replace('/','-', $request->end_date)));
        
        $income_outcome = DB::table('tbl_income_outcome')
                            ->where(function ($query) use ($start_date,$end_date) {
                                if($start_date != "" && $end_date != ""){
                                    $query->whereBetween('date', [$start_date, $end_date]);
                                }
                                return $query;
                            })->get();
     
        return Datatables::of($income_outcome)
                ->editColumn('date', function($data) {
                    $date = date('d-m-Y', strtotime($data->date));
                    $new_format = str_replace('-', '/', $date);
                    return $new_format ;
                })
                ->editColumn('total', function($data) {
                    $total = $data->income_total - $data->outcome_total;

                    return $total;
                })
                ->with('bal_sheet', $income_outcome->sum('income_total') - $income_outcome->sum('outcome_total'))
               
                ->make();
    }

    public function getTotalBalance(Request $request)
    {
        $start_date = $request->start_date == null ? '' : date('Y-m-d', strtotime(str_replace('/','-', $request->start_date))) ;
        $end_date = $request->end_date == null ? '' : date('Y-m-d', strtotime(str_replace('/','-', $request->end_date)));
      
        $income_outcome = DB::table('tbl_income_outcome')
                            ->where(function ($query) use ($start_date,$end_date) {
                                if($start_date != "" && $end_date != ""){
                                    $query->whereBetween('date', [$start_date, $end_date]);
                                }
                                return $query;
                            })->get();
        return $income_outcome;
    }
    
    public function getTotalByMonth(Request $request)
    {
        
        $total = DB::table('tbl_income_outcome')
            ->select(DB::raw('YEAR(tbl_income_outcome.date) as year'),'tbl_month.month_name as month',DB::raw('count(*) as status'),DB::raw('SUM(tbl_income_outcome.income_total) as income_total'), DB::raw('SUM(tbl_income_outcome.outcome_total) as outcome_total'))
            ->join('tbl_month', function ($join) {
                $join->where('tbl_month.id','=',DB::raw('MONTH(tbl_income_outcome.date)'));

            })
            ->groupBy(DB::raw('YEAR(tbl_income_outcome.date)'),'tbl_month.month_name')
            ->get();

        return response()->json($total, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        
    }
}
