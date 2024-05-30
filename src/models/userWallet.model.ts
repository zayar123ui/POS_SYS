import { UserRole } from "../enums/user.enum";
import { helper } from "../helper/helper";

const mongoose = require("mongoose");

const userWalletSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    balance: {
      type: Number,
      required: false,
      default: 0,
    },
    point: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userWalletSchema.pre("save", async function (this: any, next: any) {
  if (this.isNew || this.isModified("otp")) {
    this.otp = await helper.generateOTP();
  }
  next();
});

export const UserWallet = mongoose.model("user_wallet", userWalletSchema);
