import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(async (req, res) => {
  const query = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
    sort: z.enum(["newest", "price_asc", "price_desc", "popularity"]).default("newest"),
  }).parse(req.query);
  const where = {
    active: true,
    ...(query.search ? {
      OR: [
        { name: { contains: query.search, mode: "insensitive" as const } },
        { description: { contains: query.search, mode: "insensitive" as const } },
      ],
    } : {}),
    ...(query.category ? { category: { slug: query.category } } : {}),
    ...((query.minPrice !== undefined || query.maxPrice !== undefined) ? {
      price: {
        ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
        ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
      },
    } : {}),
  };
  const orderBy = query.sort === "price_asc"
    ? { price: "asc" as const }
    : query.sort === "price_desc"
      ? { price: "desc" as const }
      : query.sort === "popularity"
        ? { reviewsCount: "desc" as const }
        : { createdAt: "desc" as const };
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.product.count({ where }),
  ]);
  return res.json({ items, total, page: query.page, limit: query.limit, pages: Math.ceil(total / query.limit) });
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const id = String(req.params.id);
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }], active: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      reviews: {
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!product) return res.status(404).json({ error: "Product not found" });
  return res.json(product);
}));

export default router;
