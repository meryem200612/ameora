<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void {
  Schema::table('users',function(Blueprint $t){
   if (!Schema::hasColumn('users','first_name')) $t->string('first_name')->nullable();
   if (!Schema::hasColumn('users','last_name')) $t->string('last_name')->nullable();
   if (!Schema::hasColumn('users','phone')) $t->string('phone')->nullable();
   if (!Schema::hasColumn('users','role')) $t->string('role')->default('customer');
  });
  if (!Schema::hasTable('api_tokens')) Schema::create('api_tokens',function(Blueprint $t){$t->id();$t->foreignId('user_id')->constrained()->cascadeOnDelete();$t->string('token_hash',64)->unique();$t->timestamp('expires_at')->nullable();$t->timestamps();});
  if (!Schema::hasTable('categories')) Schema::create('categories',function(Blueprint $t){$t->id();$t->string('name');$t->string('slug')->unique();$t->string('image_url')->nullable();$t->timestamps();});
  if (!Schema::hasTable('products')) Schema::create('products',function(Blueprint $t){$t->id();$t->foreignId('category_id')->nullable()->constrained()->nullOnDelete();$t->string('name');$t->string('slug')->unique();$t->text('description')->nullable();$t->decimal('price',10,2);$t->decimal('compare_at_price',10,2)->nullable();$t->unsignedInteger('stock')->default(0);$t->string('material')->nullable();$t->string('color')->nullable();$t->string('badge')->nullable();$t->boolean('is_new')->default(false);$t->string('image_url')->nullable();$t->json('images')->nullable();$t->decimal('rating',3,2)->default(0);$t->unsignedInteger('reviews_count')->default(0);$t->timestamps();});
  if (!Schema::hasTable('addresses')) Schema::create('addresses',function(Blueprint $t){$t->id();$t->foreignId('user_id')->constrained()->cascadeOnDelete();$t->string('label')->nullable();$t->string('first_name')->nullable();$t->string('last_name')->nullable();$t->string('line1');$t->string('line2')->nullable();$t->string('city');$t->string('state');$t->string('postal_code');$t->string('country');$t->boolean('is_default')->default(false);$t->timestamps();});
  if (!Schema::hasTable('carts')) Schema::create('carts',function(Blueprint $t){$t->id();$t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();$t->string('guest_token')->nullable()->index();$t->timestamps();});
  if (!Schema::hasTable('cart_items')) Schema::create('cart_items',function(Blueprint $t){$t->id();$t->foreignId('cart_id')->constrained()->cascadeOnDelete();$t->foreignId('product_id')->constrained()->cascadeOnDelete();$t->unsignedInteger('quantity');$t->unique(['cart_id','product_id']);$t->timestamps();});
  if (!Schema::hasTable('orders')) Schema::create('orders',function(Blueprint $t){$t->id();$t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();$t->string('guest_token')->nullable()->index();$t->string('status')->default('pending');$t->decimal('total',10,2);$t->json('shipping_address')->nullable();$t->string('delivery_method')->nullable();$t->string('payment_reference')->nullable();$t->timestamps();});
  if (!Schema::hasTable('order_items')) Schema::create('order_items',function(Blueprint $t){$t->id();$t->foreignId('order_id')->constrained()->cascadeOnDelete();$t->foreignId('product_id')->nullable()->constrained()->nullOnDelete();$t->string('product_name');$t->unsignedInteger('quantity');$t->decimal('unit_price',10,2);$t->timestamps();});
  if (!Schema::hasTable('wishlists')) Schema::create('wishlists',function(Blueprint $t){$t->id();$t->foreignId('user_id')->constrained()->cascadeOnDelete();$t->foreignId('product_id')->constrained()->cascadeOnDelete();$t->unique(['user_id','product_id']);$t->timestamps();});
  if (!Schema::hasTable('newsletters')) Schema::create('newsletters',function(Blueprint $t){$t->id();$t->string('email')->unique();$t->timestamps();});
  if (!Schema::hasTable('reviews')) Schema::create('reviews',function(Blueprint $t){$t->id();$t->foreignId('product_id')->constrained()->cascadeOnDelete();$t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();$t->unsignedTinyInteger('rating');$t->string('title')->nullable();$t->text('body')->nullable();$t->timestamps();});
 }
 public function down(): void {
  foreach(['reviews','wishlists','order_items','orders','cart_items','carts','addresses','products','categories','api_tokens'] as $t) Schema::dropIfExists($t);
  Schema::table('users',function(Blueprint $t){
   foreach(['first_name','last_name','phone','role'] as $column) {
    if (Schema::hasColumn('users',$column)) $t->dropColumn($column);
   }
  });
 }
};
