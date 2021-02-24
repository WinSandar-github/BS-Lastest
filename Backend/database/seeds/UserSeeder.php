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
        User::create([
            'name' => 'admin',
            'email' => 'admin@agga.io',
            'password' => Hash::make('admin1234'),
            'role'=>'2',
            'api_key'=>Str::random(40),
        ]);
    }
}
