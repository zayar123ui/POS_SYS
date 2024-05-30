import { Router } from "express";

import { productList,buyProduct,purchaseHistory } from "../../controller/user/product.controller";
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
  productList
);
router.post(
  "/",
  authenticateToken,
  regenerateToken,
  checkUserRole([UserRole.USER]),
  buyProduct
);

router.get(
  "/purchase-history",
  authenticateToken,
  regenerateToken,
  checkUserRole([UserRole.USER]),
  purchaseHistory
);
export default router;
