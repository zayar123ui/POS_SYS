import { ObjectId } from "mongoose";
import { UserWallet } from "../../models/userWallet.model";
import { HttpError } from "../../helper/helper";

export const depositSvc = async (amount: number, user_id: ObjectId) => {
  try {
    const userWallet = await UserWallet.findOne({ user_id: user_id });
    if (!userWallet) {
      throw new HttpError("User Wallet not found", 404);
    }
    const updatedBalance = userWallet.balance + amount;
    const updatedWallet = await UserWallet.findByIdAndUpdate(
      userWallet._id,
      {
        $set: { balance: updatedBalance },
      },
      { new: true }
    );
    return updatedWallet;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getUserPointSvc = async (user_id: ObjectId) => {
  try {
    const userWallet = await UserWallet.findOne({ user_id: user_id });
    if (!userWallet) {
      throw new HttpError("User Wallet not found", 404);
    }
    return userWallet.point;
  } catch (error) {
    console.error(error);
    throw error;
  }
};