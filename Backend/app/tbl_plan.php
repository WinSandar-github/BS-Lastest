<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_plan extends Model
{
    protected $table="tbl_plan";

    public function plan_class() {
        return $this->hasOne('App\customerClass', 'id', 'class');
    }
}
