import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Lumière Diamond Ring",
    category: "rings",
    material: "18k Gold",
    color: "Gold",
    price: 485,
    stock: 8,
    rating: 4.9,
    reviewsCount: 128,
    badge: "bestseller",
    description: "A timeless solitaire ring featuring a brilliant-cut diamond set in polished 18k gold.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&auto=format",
    isNew: false,
  },
  {
    name: "Rosé Pearl Necklace",
    category: "necklaces",
    material: "Sterling Silver",
    color: "Rose Gold",
    price: 320,
    compareAtPrice: 420,
    stock: 12,
    rating: 4.7,
    reviewsCount: 94,
    badge: "sale",
    description: "Lustrous freshwater pearls strung on a delicate rose-gold plated chain.",
    imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop&auto=format",
    isNew: false,
  },
  {
    name: "Céleste Gold Bracelet",
    category: "bracelets",
    material: "14k Gold",
    color: "Gold",
    price: 275,
    stock: 15,
    rating: 4.8,
    reviewsCount: 67,
    badge: "new",
    description: "A fine chain bracelet adorned with a single pavé-set celestial charm.",
    imageUrl: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&h=600&fit=crop&auto=format",
    isNew: true,
  },
  {
    name: "Aurore Drop Earrings",
    category: "earrings",
    material: "18k Gold",
    color: "Gold",
    price: 195,
    stock: 6,
    rating: 4.6,
    reviewsCount: 52,
    badge: "new",
    description: "Elongated drop earrings featuring graduated moonstone cabochons in 18k gold settings.",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&auto=format",
    isNew: true,
  },
  {
    name: "Soleil Emerald Ring",
    category: "rings",
    material: "18k Gold",
    color: "Green",
    price: 650,
    stock: 3,
    rating: 5,
    reviewsCount: 31,
    description: "An oval-cut Colombian emerald set in a hand-crafted 18k gold bezel.",
    imageUrl: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&h=600&fit=crop&auto=format",
    isNew: false,
  },
  {
    name: "Minuit Sapphire Pendant",
    category: "necklaces",
    material: "14k White Gold",
    color: "Blue",
    price: 390,
    stock: 7,
    rating: 4.8,
    reviewsCount: 44,
    badge: "bestseller",
    description: "A cushion-cut blue sapphire suspended from a delicate white gold chain.",
    imageUrl: "https://images.unsplash.com/photo-1599459183560-5e74e3c2c40d?w=600&h=600&fit=crop&auto=format",
    isNew: false,
  },
];

async function main() {
  for (const name of ["Rings", "Necklaces", "Bracelets", "Earrings"]) {
    const slug = name.toLowerCase();
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }

  for (const item of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: item.category },
    });
    const slug = item.name.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    const { category: _category, ...productData } = item;
    await prisma.product.upsert({
      where: { slug },
      update: { ...productData, categoryId: category.id, slug },
      create: { ...productData, categoryId: category.id, slug },
    });
  }

  console.log(`Seeded ${products.length} Améora jewellery products`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
