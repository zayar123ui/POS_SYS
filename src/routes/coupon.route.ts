import { Router } from "express";

import { createCoupon } from "../controller/coupon.controller";
import {
  authenticateToken,
  regenerateToken,
  checkUserRole,
} from "../middleware/jwt.middleware";
import { UserRole } from "../enums/user.enum";

const router = Router();

router.post(
  "/",
  authenticateToken,
  regenerateToken,
  checkUserRole([UserRole.ADMIN]),
  createCoupon
);

export default router;
