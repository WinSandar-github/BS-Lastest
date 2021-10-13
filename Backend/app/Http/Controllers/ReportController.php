<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\tbl_invoice;
use Exception;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getCollectorReports(Request $request) 
    {
        try 
        {
            $time = str_replace('/', '-', $request->date);
            $time = strtotime($time);
            $date = date('Y-m-d', $time);
            
            $filter = $request->filter == 1 ? 0 : 1;

            $records = DB::table('tbl_invoices as ti')
            ->join('users as u', 'ti.user_id', '=', 'u.id')
            ->join('user_roles as ur', 'ur.id', '=', 'u.role')
            ->select(
                'u.id',
                'u.name',
                'ur.role',
                'ti.invoice_no',
                DB::raw('sum(ti.total) as collected_amount'),
                DB::raw("date_format(ti.created_at, '%Y-%m-%d') as created_at"),
                DB::raw("date_format(ti.updated_at, '%Y-%m-%d') as updated_at"),
            )
            ->where([
                [ 'cancel',  $filter ],
                [ DB::raw("date_format(ti.updated_at, '%Y-%m-%d')"), $date ]
            ])
            ->groupBy('u.name')
            ->get();

            return response()->json($records, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        } catch(Exception $e) {
            return response()->json($e, 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function getCollectorDetail(Request $request) 
    {
        try 
        {
            $time = str_replace('/', '-', $request->date);
            $time = strtotime($time);
            $date = date('Y-m-d', $time);
            $status = $request->status  == 1 ? 0 : 1;

            $records = DB::table('tbl_invoices as ti')
            ->join('tbl_customer as c', 'c.id', '=', 'ti.customer_id')
            ->select(
                'c.name as customer_name',
                'ti.invoice_no',
                DB::raw('ti.total as total'),
                DB::raw("date_format(ti.created_at, '%Y-%m-%d') as created_at"),
                DB::raw("date_format(ti.updated_at, '%Y-%m-%d') as updated_at"),
            )
            ->where([
                [ 'cancel',  $status ],
                [ DB::raw("date_format(ti.created_at, '%Y-%m-%d')"), $date ],
                [ 'user_id' , $request->user_id]
            ])
            ->get();

            $user_name = User::where('id', $request->user_id)->pluck('name')->first();

            return response()->json(['data' => $records , 'user_name' => $user_name], 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        } catch(Exception $e) {
            return response()->json($e, 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    
}
