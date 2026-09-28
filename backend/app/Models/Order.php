<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Order extends Model { protected $fillable=['user_id','guest_token','status','total','shipping_address','delivery_method','payment_reference']; protected $casts=['shipping_address'=>'array','total'=>'decimal:2']; public function items(){return $this->hasMany(OrderItem::class);} public function user(){return $this->belongsTo(User::class);} }
