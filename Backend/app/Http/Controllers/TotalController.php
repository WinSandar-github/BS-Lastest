<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\tbl_income_outcome;

class TotalController extends Controller
{
    public function getTotal()
    {
        $income_outcome = tbl_income_outcome::all();
        if(sizeof($income_outcome)){
            return response()->json($income_outcome, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    
}
