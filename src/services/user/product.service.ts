import mongoose, { Types } from "mongoose";
import { HttpError } from "../../helper/helper";
import { Coupon } from "../../models/coupon.model";
import { Product } from "../../models/product.model";
import { UserCoupon } from "../../models/userCoupon.model";
import { UserWallet } from "../../models/userWallet.model";
import { PurchaseHistory } from "../../models/purchaseHistory.model";


export const buyProductSvc = async (
  product_id: string,
  coupon_id: string | undefined,
  user_id: string
) => {
  try {
    const product = await Product.findById(product_id);
    if (!product) {
      throw new HttpError("Product not found", 404);
    }
    const coupon_obj_id = coupon_id
      ? new mongoose.Types.ObjectId(coupon_id)
      : undefined;
    const user_obj_id = new mongoose.Types.ObjectId(user_id);
    let user_coupon: any;
    if (coupon_id) {
      user_coupon = await UserCoupon.aggregate([
        { $match: { coupon_id: coupon_obj_id, user_id: user_obj_id } },
        {
          $lookup: {
            from: "coupons",
            localField: "coupon_id",
            foreignField: "_id",
            as: "coupon",
          },
        },
        { $unwind: "$coupon" },
      ]);

      if (!user_coupon[0].coupon) {
        throw new HttpError("Coupon not found", 404);
      }
      if (user_coupon[0].used) {
        throw new HttpError("Coupon already used", 400);
      }
      if (user_coupon[0].coupon.limit <= 0) {
        throw new HttpError("Coupon limit reached", 400);
      }
    }

    const user_wallet = await UserWallet.findOne({ user_id: user_id });
    if (!user_wallet) {
      throw new HttpError("User Wallet not found", 404);
    }

    const discount = user_coupon ? user_coupon[0].coupon.discount : 0;

    const price = product.price * (1 - discount / 100);

    const isSufficient = await isSufficientBalance(user_id, price);
    if (!isSufficient) {
      throw new HttpError("Insufficient balance", 400);
    }

    if (user_coupon) {
      await UserCoupon.findOneAndUpdate(
        { _id: user_coupon[0]._id },
        { $set: { used: true } }
      );
    }

    user_wallet.balance -= price;
    user_wallet.point += product.price;
    await user_wallet.save();

    await PurchaseHistory.create({
      product_id: product_id,
      user_id: user_id,
      price: price,
      coupon_id: coupon_id,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProductsSvc = async () => {
  try {
    return await Product.find();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPurchaseHistorySvc = async (user_id: string) => {
  try {
    const purchaseHistory = await PurchaseHistory.find({ user_id: user_id });
    
    return purchaseHistory;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const isSufficientBalance = async (user_id: string, price: number) => {
  const user_wallet = await UserWallet.findOne({ user_id: user_id });
  if (!user_wallet) {
    throw new HttpError("User Wallet not found", 404);
  }
  return user_wallet.balance >= price;
};

// export const reduceCouponLimit = async (coupon_id: string) => {
//   const coupon = await Coupon.findById(coupon_id);
//   if (!coupon) {
//     throw new HttpError("Coupon not found", 404);
//   }
//   coupon.limit -= 1;
//   await coupon.save();
// };
