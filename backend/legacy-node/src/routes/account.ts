import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { auth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { comparePassword, hashPassword } from "../utils/password";

const router = Router();

router.get("/", auth, asyncHandler(async (req, res) => {
  return res.json(await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, addresses: true },
  }));
}));

router.patch("/", auth, asyncHandler(async (req, res) => {
  const data = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }).parse(req.body);
  return res.json(await prisma.user.update({
    where: { id: req.user!.userId },
    data,
    select: { id: true, email: true, firstName: true, lastName: true, phone: true },
  }));
}));

router.post("/password", auth, asyncHandler(async (req, res) => {
  const data = z.object({ currentPassword: z.string(), newPassword: z.string().min(8) }).parse(req.body);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.userId } });
  if (!(await comparePassword(data.currentPassword, user.passwordHash))) {
    return res.status(400).json({ error: "Current password is incorrect" });
  }
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(data.newPassword) } });
  return res.json({ message: "Password updated" });
}));

router.post("/addresses", auth, asyncHandler(async (req, res) => {
  const data = z.object({
    label: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    isDefault: z.boolean().optional(),
  }).parse(req.body);
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.userId }, data: { isDefault: false } });
  }
  return res.status(201).json(await prisma.address.create({ data: { ...data, userId: req.user!.userId } }));
}));

router.patch("/addresses/:id", auth, asyncHandler(async (req, res) => {
  const id = String(req.params.id);
  const data = z.object({
    label: z.string().optional(),
    line1: z.string().min(1).optional(),
    line2: z.string().optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    postalCode: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    isDefault: z.boolean().optional(),
  }).parse(req.body);
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.userId }, data: { isDefault: false } });
  }
  const address = await prisma.address.findFirst({ where: { id, userId: req.user!.userId } });
  if (!address) return res.status(404).json({ error: "Address not found" });
  return res.json(await prisma.address.update({ where: { id: address.id }, data }));
}));

router.delete("/addresses/:id", auth, asyncHandler(async (req, res) => {
  await prisma.address.deleteMany({ where: { id: String(req.params.id), userId: req.user!.userId } });
  return res.status(204).send();
}));

export default router;
