<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_payment_detail extends Model
{
    protected $table = "tbl_payment_detail";
    protected $fillable = ['date','month','add_charges','customer_id','status'];

}
