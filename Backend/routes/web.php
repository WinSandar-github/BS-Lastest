<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::post('createCustomer', array('middleware' => 'cors', 'uses' => 'CustomerController@createCustomer'));
Route::post('getCustomer', array('middleware' => 'cors', 'uses' => 'CustomerController@getCustomer'));
//for income
Route::post('createIncome', array('middleware' => 'cors', 'uses' => 'IncomeController@createIncome'));
Route::post('getIncome', array('middleware' => 'cors', 'uses' => 'IncomeController@getIncome'));
Route::post('showIncomeInfo', array('middleware' => 'cors', 'uses' => 'IncomeController@showIncomeInfo'));
Route::post('updateIncome', array('middleware' => 'cors', 'uses' => 'IncomeController@updateIncome'));
Route::post('deleteIncome', array('middleware' => 'cors', 'uses' => 'IncomeController@deleteIncome'));
//for income detail
Route::post('createIncomeDetail', array('middleware' => 'cors', 'uses' => 'IncomeDetailController@createIncomeDetail'));
//for income detail by income id
Route::post('getIncomeDetailByIncomeId', array('middleware' => 'cors', 'uses' => 'IncomeDetailController@getIncomeDetailByIncomeId'));
//for Outcome
Route::post('createOutcome', array('middleware' => 'cors', 'uses' => 'OutcomeController@createOutcome'));
Route::post('getOutcome', array('middleware' => 'cors', 'uses' => 'OutcomeController@getOutcome'));
Route::post('showOutcomeInfo', array('middleware' => 'cors', 'uses' => 'OutcomeController@showOutcomeInfo'));
Route::post('updateOutcome', array('middleware' => 'cors', 'uses' => 'OutcomeController@updateOutcome'));
Route::post('deleteOutcome', array('middleware' => 'cors', 'uses' => 'OutcomeController@deleteOutcome'));
//for Outcome detail
Route::post('createOutcomeDetail', array('middleware' => 'cors', 'uses' => 'OutcomeDetailController@createOutcomeDetail'));
//for Outcome detail by Outcome id
Route::post('getOutcomeDetailByOutcomeId', array('middleware' => 'cors', 'uses' => 'OutcomeDetailController@getOutcomeDetailByOutcomeId'));
//for User
Route::post('createUser', array('middleware' => 'cors', 'uses' => 'UserController@createUser'));
Route::post('getUser', array('middleware' => 'cors', 'uses' => 'UserController@getUser'));
Route::post('showUserInfo', array('middleware' => 'cors', 'uses' => 'UserController@showUserInfo'));
Route::post('updateUser', array('middleware' => 'cors', 'uses' => 'UserController@updateUser'));
Route::post('deleteUser', array('middleware' => 'cors', 'uses' => 'UserController@deleteUser'));
//for login
Route::post('loginValidate', array('middleware' => 'cors', 'uses' => 'LoginController@loginValidate'));

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
