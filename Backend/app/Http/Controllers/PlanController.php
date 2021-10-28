<?php

namespace App\Http\Controllers;

use App\customerClass;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\tbl_plan;
use Yajra\DataTables\Facades\DataTables; 

class PlanController extends Controller
{
    public function createPlan(Request $request)
    {
        try{

            $is_existed = tbl_plan::where([
                        ['name' , $request->name],
                        ['class' , $request->class]
                    ])->get();
            
            $obj_size = count($is_existed);

            if($obj_size > 0) {

                $class = customerClass::find($request->class);
                $class_name = $class->name;

                $text = "Plan For {$request->name} {$class_name} Was Already Created";

                return response()->json($text, 409, config('common.header'), JSON_UNESCAPED_UNICODE);
            
            }else {

                $plan = new tbl_plan();
                $plan->name = $request->name;
                $plan->price = $request->price;
                $plan->class = $request->class;
                $plan->save();

                return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
           
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function getPlan(Request $request)
    {
        $plan = tbl_plan::with('plan_class')->get();

        return Datatables::of($plan)
        ->editColumn('action', function($data) {

            $paymentPage ="<div class='btn-group'>
            <button type='button' class='btn btn-primary btn-sm' onClick='showPlanInfo($data->id)'>
            <li class='fa fa-edit fa-lg'></li></button> 
            <button type='button' class='btn btn-danger btn-sm' onClick=deletePlan($data->name,$data->id)>
            <li class='fa fa-trash fa-lg' ></li ></button ></div>";

            return $paymentPage;
        })
        ->addIndexColumn()
        ->toJson();
    }

    public function showPlanInfo(Request $request)
    {
            $plan = tbl_plan::find($request->planId);
            if(empty($plan)){
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
            else{
            return response()->json($plan, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
    }

    public function updatePlan(Request $request)
    {
        try{

            $is_existed = tbl_plan::where([
                ['name' , $request->name],
                ['class' , $request->class],
                ['id' ,'<>' ,$request->planId]
            ])->get();
    
            $obj_size = count($is_existed);

            if($obj_size > 0) {

                $class = customerClass::find($request->class);
                $class_name = $class->name;

                $text = "Plan For {$request->name} {$class_name} Was Already Created";

                return response()->json($text, 409, config('common.header'), JSON_UNESCAPED_UNICODE);
            
            }else {

                $plan = tbl_plan::find($request->planId);
                $plan->name = $request->name;
                $plan->price = $request->price;
                $plan->class = $request->class;
                $plan->save();

                return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
       
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    
    public function deletePlan(Request $request)
    {
        $plan = tbl_plan::find($request->planId);
        if($plan->delete()){
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function getPlanByPlanId(Request $request)
    {
        $plan = tbl_plan::where('id','=',$request->plan_id)->get();
        if(sizeof($plan)){
            return response()->json($plan, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function editClass(Request $request) 
    {
        try
        {
            $find_class = customerClass::find($request->id);
            $find_class->color = $request->color;

            $find_class->save();

            return response()->json('Saved Successfully!', 201, config('common.header'), JSON_UNESCAPED_UNICODE);
            
        } catch( \Exception $e ) {
            return response()->json($e->getMessage(), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function get_plan_for_select(Request $request)
    {
        $plan = tbl_plan::with('plan_class')->get();

        return $plan;
    }
    
}
