import { Router } from "express";

import { createProduct } from "../controller/product.controller";
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
  createProduct
);


export default router;
