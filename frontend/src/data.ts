export type Page =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'auth'
  | 'account'
  | 'admin';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings';
  material: string;
  color: string;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  badge?: 'new' | 'bestseller' | 'sale';
  description: string;
  stock: number;
  isNew?: boolean;
}

export let products: Product[] = [
  {
    id: 1,
    name: 'Lumière Diamond Ring',
    price: 485,
    category: 'rings',
    material: '18k Gold',
    color: 'Gold',
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'bestseller',
    description: 'A timeless solitaire ring featuring a brilliant-cut diamond set in polished 18k gold. Delicate yet enduring, this piece captures light from every angle, making it perfect for daily wear or special occasions.',
    stock: 8,
  },
  {
    id: 2,
    name: 'Rosé Pearl Necklace',
    price: 320,
    originalPrice: 420,
    category: 'necklaces',
    material: 'Sterling Silver',
    color: 'Rose Gold',
    rating: 4.7,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'sale',
    description: 'Lustrous freshwater pearls strung on a delicate rose-gold plated chain. Each pearl is individually knotted for security and elegance. A refined choice for the modern woman.',
    stock: 12,
  },
  {
    id: 3,
    name: 'Céleste Gold Bracelet',
    price: 275,
    category: 'bracelets',
    material: '14k Gold',
    color: 'Gold',
    rating: 4.8,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'new',
    description: 'A fine chain bracelet adorned with a single pavé-set celestial charm. Crafted in 14k gold, this piece drapes beautifully on the wrist and catches the light with understated brilliance.',
    stock: 15,
    isNew: true,
  },
  {
    id: 4,
    name: 'Aurore Drop Earrings',
    price: 195,
    category: 'earrings',
    material: '18k Gold',
    color: 'Gold',
    rating: 4.6,
    reviews: 52,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'new',
    description: 'Elongated drop earrings featuring graduated moonstone cabochons in 18k gold settings. These earrings move gracefully and cast a luminous glow reminiscent of the dawn sky.',
    stock: 6,
    isNew: true,
  },
  {
    id: 5,
    name: 'Soleil Emerald Ring',
    price: 650,
    category: 'rings',
    material: '18k Gold',
    color: 'Green',
    rating: 5.0,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&h=800&fit=crop&auto=format',
    ],
    description: 'An oval-cut Colombian emerald, rich and deeply saturated, set in a hand-crafted 18k gold bezel. The natural inclusions within the stone are a testament to its authenticity.',
    stock: 3,
  },
  {
    id: 6,
    name: 'Minuit Sapphire Pendant',
    price: 390,
    category: 'necklaces',
    material: '14k White Gold',
    color: 'Blue',
    rating: 4.8,
    reviews: 44,
    image: 'https://images.unsplash.com/photo-1599459183560-5e74e3c2c40d?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1599459183560-5e74e3c2c40d?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'bestseller',
    description: 'A cushion-cut blue sapphire suspended from a delicate white gold chain. The deep midnight hue of the sapphire is offset beautifully against the crisp white metal.',
    stock: 7,
  },
  {
    id: 7,
    name: 'Fleur Diamond Studs',
    price: 345,
    category: 'earrings',
    material: '18k Gold',
    color: 'Gold',
    rating: 4.9,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'bestseller',
    description: 'Classic diamond stud earrings with a floral pavé halo in 18k gold. Each stone is hand-selected for brilliance and cut precision. A wardrobe essential that transcends seasons.',
    stock: 20,
  },
  {
    id: 8,
    name: 'Éclat Bangle Set',
    price: 220,
    originalPrice: 280,
    category: 'bracelets',
    material: '14k Gold',
    color: 'Gold',
    rating: 4.5,
    reviews: 39,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'sale',
    description: 'A set of three fine 14k gold bangles designed to be worn together or separately. Varying widths create visual rhythm on the wrist. Effortlessly elegant for any occasion.',
    stock: 9,
    isNew: true,
  },
  {
    id: 9,
    name: 'Velours Ruby Ring',
    price: 575,
    category: 'rings',
    material: '18k Rose Gold',
    color: 'Red',
    rating: 4.7,
    reviews: 22,
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=800&h=800&fit=crop&auto=format',
    ],
    description: 'A vivid Burmese ruby in a cushion cut, cradled in a four-prong 18k rose gold setting. The warm rose gold echoes the fiery depth of the stone with romantic intention.',
    stock: 4,
    isNew: true,
  },
  {
    id: 10,
    name: 'Ivoire Cultured Pearl Bracelet',
    price: 168,
    category: 'bracelets',
    material: 'Sterling Silver',
    color: 'White',
    rating: 4.6,
    reviews: 57,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop&auto=format',
    ],
    description: 'A single-strand bracelet of hand-knotted freshwater cultured pearls with a sterling silver lobster clasp. The ivory pearls have a soft, creamy lustre that complements every skin tone.',
    stock: 18,
  },
  {
    id: 11,
    name: 'Aube Hoop Earrings',
    price: 145,
    category: 'earrings',
    material: '14k Gold',
    color: 'Gold',
    rating: 4.4,
    reviews: 76,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&h=800&fit=crop&auto=format',
    ],
    description: 'Polished 14k gold tube hoops in a medium diameter — the size that works equally well dressed up or down. A refined everyday essential.',
    stock: 25,
  },
  {
    id: 12,
    name: 'Tendresse Layering Necklace',
    price: 235,
    category: 'necklaces',
    material: '14k Gold',
    color: 'Gold',
    rating: 4.8,
    reviews: 61,
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'new',
    description: 'A dainty 14k gold chain with a single floating diamond accent — designed to layer beautifully with other pieces in the Améora collection. Adjustable length for versatile styling.',
    stock: 14,
    isNew: true,
  },
];

export const setProducts = (items: Product[]) => { products = items; };

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: number;
  author: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}

export const testimonials: Review[] = [
  {
    id: 1,
    author: 'Sophie Laurent',
    location: 'Paris, France',
    rating: 5,
    text: 'The Lumière Diamond Ring exceeded every expectation. The craftsmanship is extraordinary — it catches the light in the most beautiful way. I receive compliments every single day.',
    date: 'August 2026',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 2,
    author: 'Mia Andersen',
    location: 'Copenhagen, Denmark',
    rating: 5,
    text: 'Améora\'s packaging alone is worth the experience — but the jewelry itself is on another level. My Rosé Pearl Necklace is heirloom quality. Beautifully made, thoughtfully delivered.',
    date: 'July 2026',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 3,
    author: 'Isabella Romano',
    location: 'Milan, Italy',
    rating: 5,
    text: 'I ordered the Céleste Bracelet as a gift for my sister and she was moved to tears. The quality is impeccable, the design is refined, and the service was absolutely seamless.',
    date: 'September 2026',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format',
  },
];

export const salesData = [
  { month: 'Jan', revenue: 12400, orders: 89 },
  { month: 'Feb', revenue: 15800, orders: 112 },
  { month: 'Mar', revenue: 19200, orders: 138 },
  { month: 'Apr', revenue: 17600, orders: 124 },
  { month: 'May', revenue: 22100, orders: 157 },
  { month: 'Jun', revenue: 25400, orders: 181 },
  { month: 'Jul', revenue: 23800, orders: 169 },
  { month: 'Aug', revenue: 28900, orders: 205 },
  { month: 'Sep', revenue: 31200, orders: 222 },
];
