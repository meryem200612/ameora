import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { auth, requireRole } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
router.use(auth, requireRole("ADMIN"));

router.get("/dashboard", asyncHandler(async (_req, res) => {
  const [users, products, orders, revenue, lowStock] = await Promise.all([
    prisma.user.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.product.findMany({ where: { stock: { lte: 5 }, active: true }, orderBy: { stock: "asc" } }),
  ]);
  return res.json({ users, products, orders, revenue: revenue._sum.total ?? 0, lowStock });
}));

router.get("/orders", asyncHandler(async (_req, res) => {
  return res.json(await prisma.order.findMany({
    include: { items: true, user: { select: { email: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
  }));
}));

router.patch("/orders/:id", asyncHandler(async (req, res) => {
  const { status } = z.object({
    status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  }).parse(req.body);
  return res.json(await prisma.order.update({ where: { id: String(req.params.id) }, data: { status } }));
}));

const productInput = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  badge: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isNew: z.boolean().optional(),
});

router.get("/products", asyncHandler(async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  return res.json(await prisma.product.findMany({
    where: search ? { name: { contains: search } } : undefined,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  }));
}));

router.post("/products", asyncHandler(async (req, res) => {
  return res.status(201).json(await prisma.product.create({ data: productInput.parse(req.body) }));
}));

router.patch("/products/:id", asyncHandler(async (req, res) => {
  return res.json(await prisma.product.update({
    where: { id: String(req.params.id) },
    data: productInput.partial().parse(req.body),
  }));
}));

router.delete("/products/:id", asyncHandler(async (req, res) => {
  await prisma.product.update({ where: { id: String(req.params.id) }, data: { active: false } });
  return res.status(204).send();
}));

router.get("/low-stock", asyncHandler(async (_req, res) => {
  return res.json(await prisma.product.findMany({ where: { active: true, stock: { lte: 5 } }, orderBy: { stock: "asc" } }));
}));

router.get("/categories", asyncHandler(async (_req, res) => {
  return res.json(await prisma.category.findMany({ include: { _count: { select: { products: true } } } }));
}));

router.post("/categories", asyncHandler(async (req, res) => {
  const data = z.object({ name: z.string().min(1), slug: z.string().min(1), imageUrl: z.string().url().optional() }).parse(req.body);
  return res.status(201).json(await prisma.category.create({ data }));
}));

export default router;
