import { Router } from "express";

import { couponList, exchangeCoupon } from "../../controller/user/coupon.controller";
import {
  authenticateToken,
  regenerateToken,
  checkUserRole,
} from "../../middleware/jwt.middleware";
import { UserRole } from "../../enums/user.enum";

const router = Router();

router.get(
  "/",
  authenticateToken,
  regenerateToken,
  checkUserRole([UserRole.USER]),
  couponList
);

router.post(
  "/exchange",
  authenticateToken,
  regenerateToken,
  checkUserRole([UserRole.USER]),
  exchangeCoupon
);


export default router;
