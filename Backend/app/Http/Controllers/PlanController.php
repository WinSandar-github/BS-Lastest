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

class PlanController extends Controller
{
    public function createPlan(Request $request)
    {
        try{

            $plan = new tbl_plan();
            $plan->name = $request->name;
            $plan->price = $request->price;
            $plan->class = $request->class;
            $plan->save();

            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function getPlan(Request $request)
    {
        $plan = tbl_plan::with('plan_class')->get();
        if(sizeof($plan)){
            return response()->json($plan, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
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
                $plan = tbl_plan::find($request->planId);
                $plan->name = $request->name;
                $plan->price = $request->price;
                $plan->class = $request->class;
                $plan->save();
                
                return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
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
}
