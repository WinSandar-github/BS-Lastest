<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
            [
                'name' => 'admin',
                'email' => 'admin@iqnet.tech',
                'password' => Hash::make('admin1234'),
                'role'=>'1',
                'api_key'=>Str::random(40)
            ],
            [
                'name' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('admin1234'),
                'role'=>'1',
                'api_key'=>Str::random(40)
            ]
            
        ];
        foreach($users as $user){
            User::create($user);
        }
    }
}
