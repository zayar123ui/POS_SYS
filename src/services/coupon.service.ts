import { Coupon } from "../models/coupon.model";
import { Product } from "../models/product.model";

export const addCouponSvc = async (
  point: number,
  discount: number,
  limit: number
) => {
  try {
    const coupon = await Coupon.create({
      point,
      discount,
      limit,
    });
    return coupon;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
