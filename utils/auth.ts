import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const TOKEN_SECRET = "kucing";
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Leave the Bearer
  console.log(token, TOKEN_SECRET);

  if (!token) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  });
}
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as { role: string } | undefined;

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Only admins can perform this action" });
  }

  next();
}

