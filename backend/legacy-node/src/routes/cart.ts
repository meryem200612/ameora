import crypto from "node:crypto";
import { Request, Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { optionalAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
router.use(optionalAuth);

async function getCart(req: Request) {
  const guestToken = typeof req.headers["x-guest-token"] === "string"
    ? req.headers["x-guest-token"]
    : undefined;
  return prisma.cart.findFirst({
    where: req.user
      ? { userId: req.user.userId }
      : guestToken
        ? { guestToken }
        : { id: "missing-cart" },
    include: { items: { include: { product: true } } },
  });
}

const cartResponse = (cart: Awaited<ReturnType<typeof getCart>>) => cart;

router.get("/", asyncHandler(async (req, res) => {
  return res.json(await getCart(req));
}));

router.post("/items", asyncHandler(async (req, res) => {
  const data = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive().max(99),
    guestToken: z.string().min(1).optional(),
  }).parse(req.body);
  let cart = await getCart(req);
  if (!cart) {
    cart = await prisma.cart.create({
      data: req.user ? { userId: req.user.userId } : { guestToken: data.guestToken ?? crypto.randomUUID() },
      include: { items: { include: { product: true } } },
    });
  }
  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId: data.productId } },
    update: { quantity: data.quantity },
    create: { cartId: cart.id, productId: data.productId, quantity: data.quantity },
  });
  return res.status(201).json(cartResponse(await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } },
  })));
}));

router.patch("/items/:productId", asyncHandler(async (req, res) => {
  const productId = String(req.params.productId);
  const { quantity } = z.object({ quantity: z.number().int().min(0).max(99) }).parse(req.body);
  const cart = await getCart(req);
  if (!cart) return res.status(404).json({ error: "Cart not found" });
  if (quantity === 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  } else {
    await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity },
    });
  }
  return res.json(await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } },
  }));
}));

router.delete("/items/:productId", asyncHandler(async (req, res) => {
  const productId = String(req.params.productId);
  const cart = await getCart(req);
  if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  return res.status(204).send();
}));

export default router;
