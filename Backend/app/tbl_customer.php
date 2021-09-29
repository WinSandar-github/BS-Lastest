<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_customer extends Model
{
    protected $table='tbl_customer';
    
    public function plan()
    {
        return $this->belongsTo('App\tbl_plan','plan');
    }

    public function class() 
    {
        return $this->hasOne('App\customerClass', 'id', 'customer_class');
    }

    public function initial_payment()
    {
        return $this->belongsTo('App\tbl_payment_plan','payment_plan_id');
    }

    public function payment_detail() 
    {
        return $this->hasMany('App\tbl_payment_detail', 'customer_id', 'id');
    }

}
