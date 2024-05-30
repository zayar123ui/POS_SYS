import { Router } from "express";

import productRouter from "./product.route";
import couponRouter from "./coupon.route";

const router = Router();

router.use("/product", productRouter);
router.use("/coupon", couponRouter);
export default router;
