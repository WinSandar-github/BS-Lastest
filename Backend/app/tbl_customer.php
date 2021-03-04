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
}
