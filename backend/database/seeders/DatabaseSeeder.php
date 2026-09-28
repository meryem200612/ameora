<?php

namespace Database\Seeders;

use App\Models\{User,Category,Product};
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin=User::factory()->create(['name'=>'Ameora Admin','first_name'=>'Ameora','last_name'=>'Admin','email'=>'admin@ameora.com','password'=>'password','role'=>'admin']);
        User::factory()->create(['name'=>'Test User','first_name'=>'Test','last_name'=>'User','email'=>'test@example.com','password'=>'password']);
        $cats=[]; foreach([['Rings','rings'],['Necklaces','necklaces'],['Bracelets','bracelets'],['Earrings','earrings']] as [$n,$s]) $cats[$s]=Category::create(['name'=>$n,'slug'=>$s]);
        $items=[['Lumiere Ring','rings',129,'Gold'],['Rose Necklace','necklaces',159,'Rose Gold'],['Celeste Bracelet','bracelets',99,'Silver'],['Aurore Earrings','earrings',119,'Gold'],['Soleil Emerald Ring','rings',249,'Gold'],['Minuit Sapphire Pendant','necklaces',229,'Silver']];
        foreach($items as [$name,$cat,$price,$material]) Product::create(['category_id'=>$cats[$cat]->id,'name'=>$name,'slug'=>\Illuminate\Support\Str::slug($name), 'description'=>'Ameora fine jewelry crafted for radiant everyday moments.','price'=>$price,'compare_at_price'=>$price+30,'stock'=>20,'material'=>$material,'color'=>$material,'is_new'=>true,'badge'=>'new','image_url'=>'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800']);
    }
}
