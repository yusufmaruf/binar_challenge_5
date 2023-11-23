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
    console.log(req.user);
    next();
  });
}
export function isfulladmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as { role: string } | undefined;
  console.log(user);

  if (!user || user.role !== "admin" && user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden - Only admins and Super Admin can perform this action" });
  }

  next();
}
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as { role: string } | undefined;
  console.log(user);

  if (!user || user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden - Only admins can perform this action" });
  }

  next();
}


