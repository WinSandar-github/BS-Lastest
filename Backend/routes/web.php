<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

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
//for Total
Route::post('getTotal', array('middleware' => 'cors', 'uses' => 'TotalController@getTotal'));
//for customer edit and delete
Route::post('showCustomerInfo', array('middleware' => 'cors', 'uses' => 'CustomerController@showCustomerInfo'));
Route::post('updateCustomer', array('middleware' => 'cors', 'uses' => 'CustomerController@updateCustomer'));
Route::post('deleteCustomer', array('middleware' => 'cors', 'uses' => 'CustomerController@deleteCustomer'));
//for user payment
Route::post('createPayment', array('middleware' => 'cors', 'uses' => 'PaymentController@createPayment'));
Route::post('getPaymentDetail', array('middleware' => 'cors', 'uses' => 'PaymentController@getPaymentDetail'));
Route::post('getPaymentDetailBypaymentId', array('middleware' => 'cors', 'uses' => 'PaymentController@getPaymentDetailBypaymentId'));
Route::post('delete_payment_detail', array('middleware' => 'cors', 'uses' => 'PaymentController@delete_payment_detail'));

Auth::routes();
//for remaining credit list
Route::post('getCreditList', array('middleware' => 'cors', 'uses' => 'PaymentController@getCreditList'));
//for plan
Route::post('createPlan', array('middleware' => 'cors', 'uses' => 'PlanController@createPlan'));
Route::post('getPlan', array('middleware' => 'cors', 'uses' => 'PlanController@getPlan'));
Route::post('showPlanInfo', array('middleware' => 'cors', 'uses' => 'PlanController@showPlanInfo'));
Route::post('updatePlan', array('middleware' => 'cors', 'uses' => 'PlanController@updatePlan'));
Route::post('deletePlan', array('middleware' => 'cors', 'uses' => 'PlanController@deletePlan'));
//for get price by plan
Route::post('getPlanByPlanId', array('middleware' => 'cors', 'uses' => 'PlanController@getPlanByPlanId'));
//for invoice
Route::post('getCustomerById', array('middleware' => 'cors', 'uses' => 'CustomerController@getCustomerById'));
Route::post('matchId', array('middleware' => 'cors', 'uses' => 'CustomerController@matchId'));

Route::post('get_customer_for_payment', array('middleware' => 'cors', 'uses' => 'PaymentController@getCustomerForPayment'));

Route::post('get_customer_class', array('middleware' => 'cors', 'uses' => 'CustomerController@getCustomerClass'));
Route::post('edit_class', array('middleware' => 'cors', 'uses' => 'PlanController@editClass'));

Route::get('get_initital_payment_month', array('middleware' => 'cors', 'uses' => 'CustomerController@get_initital_payment_month'));

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/welcome', 'HomeController@index')->name('home');

Route::post('get_customer_for_invoicing', array('middleware' => 'cors', 'uses' => 'PaymentController@getCustomerForInvoicing'));
Route::post('add_to_invoice', array('middleware' => 'cors', 'uses' => 'PaymentController@addToInvoice'));

Route::post('createInvoice', array('middleware' => 'cors', 'uses' => 'InvoiceController@createInvoice'));

Route::get('getPaymentInvoice', 'InvoiceController@getPaymentInvoice');

Route::get('getAllInvoices', 'InvoiceController@getAllInvoices');

Route::get('showInvoice', 'InvoiceController@showInvoice');

Route::post('updateInvoice', array('middleware' => 'cors', 'uses' => 'InvoiceController@updateInvoice'));


Route::get('/publicgetPlan', function() {
    return 'Hello';
});


