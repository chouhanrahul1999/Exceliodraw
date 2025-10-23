import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const { JWT_SECRET } = require("@repo/backend-common/config");
const jwtSecret: string = typeof JWT_SECRET === 'string' ? JWT_SECRET : process.env.JWT_SECRET || '';

export function middleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  // Expecting format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ message: "Malformed token" });
    return;
  }
  const token = parts[1];
  if (!jwtSecret) {
    res.status(500).json({ message: "JWT secret not configured" });
    return;
  }
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  try {
    const decoded = jwt.verify(token as string, jwtSecret);
    // @ts-ignore
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
}
