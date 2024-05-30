import { Router } from "express";

import { deposite, points } from "../../controller/user/wallet.controller";
import {
  authenticateToken,
  regenerateToken,
  checkUserRole,
} from "../../middleware/jwt.middleware";
import { UserRole } from "../../enums/user.enum";

const router = Router();

router.post(
  "/deposite",
  authenticateToken,
  regenerateToken,
  checkUserRole([UserRole.USER]),
  deposite
);
router.get(
  "/point",
  authenticateToken,
  regenerateToken,
  checkUserRole([UserRole.USER]),
  points
);
export default router;
