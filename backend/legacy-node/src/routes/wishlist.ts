import { Router } from "express";
import { prisma } from "../lib/prisma";
import { auth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
router.use(auth);

router.get("/", asyncHandler(async (req, res) => {
  return res.json(await prisma.wishlistItem.findMany({
    where: { userId: req.user!.userId },
    include: { product: true },
  }));
}));

router.post("/:productId", asyncHandler(async (req, res) => {
  const productId = String(req.params.productId);
  const item = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: req.user!.userId, productId } },
    update: {},
    create: { userId: req.user!.userId, productId },
    include: { product: true },
  });
  return res.status(201).json(item);
}));

router.delete("/:productId", asyncHandler(async (req, res) => {
  await prisma.wishlistItem.deleteMany({
    where: { userId: req.user!.userId, productId: String(req.params.productId) },
  });
  return res.status(204).send();
}));

export default router;
