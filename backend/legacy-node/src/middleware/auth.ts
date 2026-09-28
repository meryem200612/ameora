import { RequestHandler } from "express";
import { verifyToken } from "../utils/jwt";

export const optionalAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();
  try {
    req.user = verifyToken(header.slice(7));
  } catch {
    return next();
  }
  return next();
};

export const auth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    req.user = verifyToken(header.slice(7));
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireRole =
  (role: "ADMIN" | "CUSTOMER"): RequestHandler =>
  (req, res, next) =>
    req.user?.role === role ? next() : res.status(403).json({ error: "Forbidden" });
