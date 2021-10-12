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
        $start_date = $request->start_date == null ? '' : date('Y-d-m', strtotime($request->start_date)) ;
        $end_date = $request->end_date == null ? '' : date('Y-d-m', strtotime($request->end_date));
      
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
        $start_date = $request->start_date == null ? '' : date('Y-d-m', strtotime($request->start_date)) ;
        $end_date = $request->end_date == null ? '' : date('Y-d-m', strtotime($request->end_date));
      
        $income_outcome = DB::table('tbl_income_outcome')
                            ->where(function ($query) use ($start_date,$end_date) {
                                if($start_date != "" && $end_date != ""){
                                    $query->whereBetween('date', [$start_date, $end_date]);
                                }
                                return $query;
                            })->get();
        return $income_outcome;
       }
    
}
