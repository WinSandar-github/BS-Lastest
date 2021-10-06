<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tbl_invoice;
use Exception;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getCollectorReports(Request $request) 
    {
        try 
        {
            $records = DB::table('tbl_invoices as ti')
            ->join('users as u', 'ti.user_id', '=', 'u.id')
            ->join('user_roles as ur', 'ur.id', '=', 'u.role')
            ->select(
                'u.name',
                'ur.role',
                'ti.invoice_no',
                DB::raw('sum(ti.total) as collected_amount'),
                DB::raw("date_format(ti.created_at, '%Y-%m-%d') as created_at"),
                DB::raw("date_format(ti.updated_at, '%Y-%m-%d') as updated_at"),
            )
            ->where([
                [ 'cancel', 0 ],
                [ DB::raw("date_format(ti.updated_at, '%Y-%m-%d')"), $request->date ]
            ])
            ->groupBy('u.name')
            ->get();

            return response()->json($records, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        } catch(Exception $e) {
            return response()->json($e, 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
