import { Request, Response } from "express";
import { HttpError, response } from "../../helper/helper";
import { getCouponSvc,exchangeCouponSvc } from "../../services/user/coupon.service";

export const couponList = async (req: Request, res: Response) => {
  try {
    const owned = req.query.owned as unknown as string;
    const user_id = req.user.userId;
    const products = await getCouponSvc(user_id,owned);
    return response.success(
      res,
      200,
      "Coupon List Fetch successfully",
      products
    );
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

export const exchangeCoupon = async (req: Request, res: Response) => {
  try {
    const { coupon_id } = req.body;
    const user_id = req.user.userId;
    await exchangeCouponSvc(coupon_id,user_id);
    return response.success(
      res,
      200,
      "Coupon exchanged successfully"
    );
  } catch (error) {

   if (error instanceof HttpError) {
     return response.fail(res, error.statusCode, error.message);
   } else {
     return response.internal(res, 500, "Internal server error", error);
   }
  }
};
