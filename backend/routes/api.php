<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController as C;
Route::get('/health',[C::class,'health']);
Route::get('/products',[C::class,'products']); Route::get('/products/{id}',[C::class,'product']);
Route::post('/auth/register',[C::class,'register']); Route::post('/auth/login',[C::class,'login']); Route::post('/auth/forgot-password',[C::class,'forgot']); Route::post('/auth/reset-password',[C::class,'reset']);
Route::get('/cart',[C::class,'cartGet']); Route::post('/cart/items',[C::class,'cartAdd']); Route::patch('/cart/items/{id}',[C::class,'cartUpdate']); Route::delete('/cart/items/{id}',[C::class,'cartRemove']);
Route::post('/checkout',[C::class,'checkout']); Route::get('/checkout',[C::class,'orders']);
Route::post('/newsletter',[C::class,'newsletter']);
Route::get('/products/{id}/reviews',[C::class,'reviews']);
Route::middleware('api.token')->group(function(){ 
 Route::get('/auth/me',[C::class,'me']); Route::get('/account',[C::class,'account']); Route::patch('/account',[C::class,'accountUpdate']); Route::post('/account/password',[C::class,'password']);
 Route::post('/account/addresses',[C::class,'addressAdd']); Route::patch('/account/addresses/{id}',[C::class,'addressUpdate']); Route::delete('/account/addresses/{id}',[C::class,'addressRemove']);
 Route::get('/wishlist',[C::class,'wishlist']); Route::post('/wishlist/{id}',[C::class,'wishlistAdd']); Route::delete('/wishlist/{id}',[C::class,'wishlistRemove']);
 Route::post('/products/{id}/reviews',[C::class,'reviewAdd']);
 Route::prefix('admin')->middleware('admin')->group(function(){Route::get('/dashboard',[C::class,'adminDashboard']);Route::get('/products',[C::class,'adminProducts']);Route::post('/products',[C::class,'adminProductCreate']);Route::patch('/products/{id}',[C::class,'adminProductUpdate']);Route::delete('/products/{id}',[C::class,'adminProductDelete']);Route::get('/orders',[C::class,'adminOrders']);Route::patch('/orders/{id}',[C::class,'adminOrderUpdate']);Route::get('/categories',[C::class,'adminCategories']);Route::post('/categories',[C::class,'adminCategoryCreate']);});
});
