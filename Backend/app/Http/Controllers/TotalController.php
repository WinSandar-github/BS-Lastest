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
        // str_replace('/', '-', $request->date)
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
                ->addIndexColumn()
                ->toJson();
        // if(sizeof($income_outcome)){
        //     return response()->json($income_outcome, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        // }
        // else{
        //     return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        // }
    }
    
}
