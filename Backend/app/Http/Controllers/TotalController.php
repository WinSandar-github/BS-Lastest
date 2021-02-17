<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\tbl_income;
use App\tbl_outcome;

class TotalController extends Controller
{
    public function getTotal()
    {
        $total = DB::table('tbl_income')
                ->join('tbl_outcome','tbl_outcome.outcome_date','tbl_income.income_date')
                ->select('tbl_income.id as income_id','tbl_income.*','tbl_outcome.id as outcome_id','tbl_outcome.*')
                ->get();
        if(sizeof($total)){
            return response()->json($total, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
