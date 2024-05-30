import { Router } from "express";

import productRouter from "./user/product.route";
import walletRouter from "./user/wallet.route";
import couponRouter from "./user/coupon.route";
import {
  authenticateToken,
  regenerateToken,
} from "../middleware/jwt.middleware";

const router = Router();

router.use("/product", productRouter);
router.use("/wallet", walletRouter);
router.use("/coupon", couponRouter);
// router.get("/profile", authenticateToken, regenerateToken, (req, res) => {
//   res.json({ message: "This is the user profile.", user: req.user });
// });
export default router;
