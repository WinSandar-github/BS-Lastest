<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\user;

class LoginController extends Controller
{
    public function loginValidate(Request $request)
	{
		$user_data = json_decode($request->getContent(), true);
	    $email = $user_data['email'];
		$password = $user_data['password'];
		$data=  array(
			'email' => $email,
			'password' => $password
		);
		if(auth::attempt($data)){
			$user = auth::user();

			$data = array( 
				'id' => $user->id,
				'name' => $user->name,
				'email' => $user->email,
				'api_key' => $user->api_key,
				'role' => $user->role
				
			);
            return response()->json($data, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
		}else{
			return 0;
		}
    }
}
