import { ObjectId } from "mongoose";
import { Coupon } from "../../models/coupon.model";
import { HttpError } from "../../helper/helper";
import { UserWallet } from "../../models/userWallet.model";
import { UserCoupon } from "../../models/userCoupon.model";

export const getCouponSvc = async (user_id: string, owned: string) => {
  try {
    let coupons;
    const isOwned = owned === "true";
    if(isOwned){
      coupons = await UserCoupon.find({ user_id });
    }
    else{
      coupons = await Coupon.find();
    }
    return coupons;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const exchangeCouponSvc = async (coupon_id: string,user_id:string) => {
  try {
    const coupon = await Coupon.findById(coupon_id);
    if (!coupon) {
      throw new HttpError("Coupon not found", 404);
    }
    if(coupon.limit <= 0){
      throw new HttpError("Coupon limit reached", 400);
    }
    const userWallet = await UserWallet.findOne({ user_id });
    if (!userWallet) {
      throw new HttpError("User wallet not found", 404);
    }

    const userCoupon = await UserCoupon.findOne({ user_id, coupon_id });
    if (userCoupon) {
      throw new HttpError("Coupon already exchanged", 400);
    }

    if(userWallet.point < coupon.point){
      throw new HttpError("Insufficient points", 400);
    }
    const newUserCoupon = new UserCoupon({
      user_id,
      coupon_id,
    });
    await newUserCoupon.save();

    userWallet.point -= coupon.point;
    await userWallet.save();

    coupon.limit -= 1;
    await coupon.save();

    return {
      message: "Coupon exchanged successfully",
      userWallet,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};