<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use App\Models\ApiToken as ApiTokenModel;
class ApiToken {
 public function handle(Request $request, Closure $next) {
  $value=trim((string)$request->bearerToken()); $user=null;
  if($value && str_starts_with($value,'ameora_')) { $token=ApiTokenModel::with('user')->where('token_hash',hash('sha256',$value))->first(); if($token && (!$token->expires_at || $token->expires_at->isFuture())) $user=$token->user; }
  if(!$user) return response()->json(['error'=>'Unauthenticated'],401);
  $request->setUserResolver(fn()=>$user); return $next($request);
 }
}
