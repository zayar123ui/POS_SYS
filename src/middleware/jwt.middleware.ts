import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware to authenticate token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {

      if (err.name === "TokenExpiredError") {
        console.log("Token expired. Regenerating...");
        const decoded = jwt.decode(token);
        req.user = decoded;
        return regenerateToken(req, res, next);
      } else {
        return res.sendStatus(403);
      }
    }
    req.user = user;
    next();
  });
};

export const regenerateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!req.user) {
    return res
      .status(403)
      .json({ message: "No user data found for token regeneration." });
  }

  const newToken = jwt.sign(
    { userId: user.userId, email: user.email, userType: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  res.setHeader("Authorization", `Bearer ${newToken}`);
  next();
};

export const checkUserRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    console.log(user);
    if (!allowedRoles.includes(user.userType)) {
      return res
        .status(403)
        .json({ message: "Access denied. User must be admin." });
    }

    next();
  };
};
