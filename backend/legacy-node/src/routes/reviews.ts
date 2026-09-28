import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { auth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/:productId", asyncHandler(async (req, res) => {
  return res.json(await prisma.review.findMany({
    where: { productId: String(req.params.productId) },
    include: { user: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
  }));
}));

router.post("/:productId", auth, asyncHandler(async (req, res) => {
  const productId = String(req.params.productId);
  const data = z.object({
    rating: z.number().int().min(1).max(5),
    title: z.string().max(120).optional(),
    body: z.string().min(1).max(5000),
  }).parse(req.body);
  const review = await prisma.review.upsert({
    where: { userId_productId: { userId: req.user!.userId, productId } },
    update: data,
    create: { ...data, userId: req.user!.userId, productId },
  });
  const aggregate = await prisma.review.aggregate({ where: { productId }, _avg: { rating: true }, _count: true });
  await prisma.product.update({
    where: { id: productId },
    data: { rating: aggregate._avg.rating ?? 0, reviewsCount: aggregate._count },
  });
  return res.status(201).json(review);
}));

export default router;
