<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Hash;
use Illuminate\Support\Str;
use App\user;

class UserController extends Controller
{
    public function createUser(Request $request)
    {
         try{
                $data = json_decode($request->getContent(), true);
                $user=new user();
                $user->name=$data["name"];
                $user->email =$data["email"];
                $user->password=Hash::make($data["password"]);
                $user->role=$data["role"];
                $user->api_key=str_random(40);
                $user->save();
               return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
            }catch (\Exception $e) {
               return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
            }
    }
    public function getUser(Request $request)
    {
        $user = user::all();
        if(sizeof($user)){
            return response()->json($user, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function showUserInfo(Request $request)
    {
         $user = user::find($request->userId);
         if(empty($user)){
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
            return response()->json($user, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }
    
    public function updateUser(Request $request)
    {
        try{
            $data = json_decode($request->getContent(), true);
            $user = user::find($data["userId"]);
            $user->name = $data["name"];
            $user->email = $data["email"];
            $user->role = $data["role"];
            if($data["password"]!="null"){
                $user->password = hash::make($data["password"]);
            }
            $user->save();
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function deleteUser(Request $request)
    {
        $user = user::find($request->userId);
        if($user->delete()){
           return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);}
        else{
             return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}
