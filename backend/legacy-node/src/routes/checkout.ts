import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { optionalAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const checkoutSchema = z.object({
  paymentToken: z.string().min(1),
  guestToken: z.string().min(1).optional(),
  deliveryMethod: z.enum(["standard", "express", "overnight"]).default("standard"),
  shippingAddress: z.record(z.string()),
});

router.post(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const data = checkoutSchema.parse(req.body);
    const guestToken = data.guestToken ?? req.headers["x-guest-token"];
    const cart = await prisma.cart.findFirst({
      where: req.user
        ? { userId: req.user.userId }
        : typeof guestToken === "string"
          ? { guestToken }
          : { id: "missing-cart" },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          const error = new Error(`${item.product.name} is out of stock`) as Error & {
            statusCode?: number;
          };
          error.statusCode = 400;
          throw error;
        }
        subtotal += Number(item.product.price) * item.quantity;
      }

      const shipping =
        data.deliveryMethod === "express"
          ? 25
          : data.deliveryMethod === "overnight"
            ? 45
            : subtotal >= 150
              ? 0
              : 12;

      const createdOrder = await tx.order.create({
        data: {
          userId: req.user?.userId,
          status: "PAID",
          subtotal,
          shipping,
          total: subtotal + shipping,
          deliveryMethod: data.deliveryMethod,
          paymentToken: data.paymentToken,
          shippingAddress: data.shippingAddress,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              unitPrice: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return createdOrder;
    });

    return res.status(201).json(order);
  }),
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required to view orders" });
    }
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(orders);
  }),
);

export default router;
