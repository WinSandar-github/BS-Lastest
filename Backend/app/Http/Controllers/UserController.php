<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\UserRoles;
use App\User;
use Yajra\DataTables\Facades\DataTables; 

class UserController extends Controller
{
    public function createUser(Request $request)
    {
         try{
                $data = json_decode($request->getContent(), true);
                $User=new User();
                $User->name=$data["name"];
                $User->email =$data["email"];
                $User->password=Hash::make($data["password"]);
                $User->role=$data["role"];
                $User->api_key=str_random(40);
                $User->save();
               return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
            }catch (\Exception $e) {
               return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
    }

    public function getUser(Request $request)
    {
        $User = User::with('role')->get();

        return Datatables::of($User)
        ->editColumn('action', function($data) {
            $paymentPage ="<div class='btn-group'><td class='text-center'><div class='btn-group'>
            <button type='button' class='btn btn-primary btn-sm' onClick='showUserInfo($data->id)'>
            <li class='fa fa-edit fa-lg'></li></button> 
            <button type='button' class='btn btn-danger btn-sm' onClick=deleteUser($data->name,$data->id)>
            <li class='fa fa-trash fa-lg' ></li ></button></div>";

            return $paymentPage;
        })
        ->addIndexColumn()
        ->toJson();
        
    }

    public function showUserInfo(Request $request)
    {
         $User = User::find($request->userId);
         if($User){
            return response()->json($User, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
           
         }
         else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }
    
    public function updateUser(Request $request)
    {
        try{
            $data = json_decode($request->getContent(), true);
            $User = User::find($data["userId"]);
            $User->name = $data["name"];
            $User->email = $data["email"];
            $User->role = $data["role"];
            if($data["password"]!="null"){
                $User->password = hash::make($data["password"]);
            }
            $User->save();
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    
    public function deleteUser(Request $request)
    {
        try 
        {
            $User = User::find($request->userId);

            if ($User->role == 1) {                
                return response()->json("Sorry Admin Cannot Delete Other Admins!", 405, config('common.header'), JSON_UNESCAPED_UNICODE);
            } else {
                $User->delete();
                return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        } 
    }

    public function getUserRoles() 
    {
        $roles = UserRoles::all();

        if ( count($roles) > 0 ) {
            return response()->json($roles, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        } else {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
