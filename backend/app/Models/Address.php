<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Address extends Model { protected $fillable=['user_id','label','first_name','last_name','line1','line2','city','state','postal_code','country','is_default']; protected $casts=['is_default'=>'boolean']; }
