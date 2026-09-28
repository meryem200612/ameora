<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Product extends Model {
    protected $fillable=['category_id','name','slug','description','price','compare_at_price','stock','material','color','badge','is_new','image_url','images'];
    protected $casts=['price'=>'decimal:2','compare_at_price'=>'decimal:2','is_new'=>'boolean','images'=>'array'];
    public function category(){return $this->belongsTo(Category::class);}
    public function toFrontend(){ $p=$this->loadMissing('category'); return ['id'=>(string)$p->id,'name'=>$p->name,'slug'=>$p->slug,'price'=>$p->price,'compareAtPrice'=>$p->compare_at_price,'description'=>$p->description,'stock'=>$p->stock,'rating'=>(float)($p->rating ?? 0),'reviewsCount'=>$p->reviews_count ?? 0,'material'=>$p->material,'color'=>$p->color,'badge'=>$p->badge,'isNew'=>$p->is_new,'category'=>$p->category?['slug'=>$p->category->slug,'name'=>$p->category->name]:null,'imageUrl'=>$p->image_url,'images'=>collect($p->images ?: [])->map(fn($u)=>['url'=>$u])->values()]; }
}
