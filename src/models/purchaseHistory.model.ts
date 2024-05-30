import { ProductType } from "../enums/product.enum";
import { helper } from "../helper/helper";

const mongoose = require("mongoose");

const purchaseHistorySchema = new mongoose.Schema(
  {
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupons",
      required: false,
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

purchaseHistorySchema.pre("save", async function (this: any, next: any) {
  if (this.isNew || this.isModified("otp")) {
    this.otp = await helper.generateOTP();
  }
  next();
});

export const PurchaseHistory = mongoose.model("purchase_history", purchaseHistorySchema);
