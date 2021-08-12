<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Hash;
use Illuminate\Support\Str;
use App\User;

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
        $User = User::all();
        if(sizeof($User)){
            return response()->json($User, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
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
        $User = User::find($request->UserId);
        if($User->delete()){
           return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);}
        else{
             return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
