<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_invoice extends Model
{
    public function user() {
        return $this->hasOne('App\User', 'id', 'user_id');
    }
}
