<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\tbl_income_outcome;
use Yajra\DataTables\Facades\DataTables; 

class TotalController extends Controller
{
    public function getTotal()
    {
        $income_outcome = tbl_income_outcome::all();
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
    
}
