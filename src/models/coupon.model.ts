import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    point: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Coupon = mongoose.model("coupons", couponSchema);
