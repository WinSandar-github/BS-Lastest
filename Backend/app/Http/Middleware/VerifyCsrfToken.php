<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'createCustomer',
        'getCustomer',
        'createIncome',
        'getIncome',
        'showIncomeInfo',
        'updateIncome',
        'deleteIncome',
        'createIncomeDetail',
        'getIncomeDetailByIncomeId',
        'createOutcome',
        'getOutcome',
        'showOutcomeInfo',
        'updateOutcome',
        'deleteOutcome',
        'createOutcomeDetail',
        'getOutcomeDetailByOutcomeId',
        'createUser',
        'getUser',
        'showUserInfo',
        'updateUser',
        'deleteUser',
        'loginValidate',
        'getTotal',
        'showCustomerInfo',
        'updateCustomer',
        'deleteCustomer',
        'createPayment',
        'getPaymentDetail',
        'getCreditList',
        'getPaymentDetailBypaymentId',
        'createPlan',
        'getPlan',
        'showPlanInfo',
        'updatePlan',
        'deletePlan',
        'getPlanByPlanId',
        'getCustomerById',
        'matchId',
        'delete_payment_detail',
        'get_customer_for_payment',
        'get_customer_class',
        'edit_class',
        'get_customer_for_invoicing',
        'add_to_invoice',
        'createInvoice',
        'getAllInvoices',
        'del_inv_history'
    ];
}
