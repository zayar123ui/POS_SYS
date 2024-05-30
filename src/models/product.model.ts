import { ProductType } from "../enums/product.enum";
import { UserRole } from "../enums/user.enum";
import { helper } from "../helper/helper";

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

productSchema.pre("save", async function (this: any, next: any) {
  if (this.isNew || this.isModified("otp")) {
    this.otp = await helper.generateOTP();
  }
  next();
});

export const Product = mongoose.model("products", productSchema);
