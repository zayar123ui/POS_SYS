import { Request, Response } from "express";
import { response } from "../helper/helper";
import { addCouponSvc } from "../services/coupon.service";

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { point, discount, limit } = req.body;
    const coupon = await addCouponSvc(point, discount, limit);
    return response.success(res, 200, "Coupon added successfully", coupon);
  } catch (error) {
    console.log(error);
    return response.internal(
      res,
      500,
      "Internal server error.",
      error as unknown as string
    );
  }
};
