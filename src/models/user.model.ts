import { UserRole } from "../enums/user.enum";
import { helper } from "../helper/helper";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: UserRole,
      required: false,
    },
    device: {
      type: String,
      required: false,
      default: null,
    },
    qrCode: {
      type: String,
      required: false,
      default: null,
    },
    otp: {
      type: String,
      required: false,
      default: null,
    },
    verified: {
      type: Boolean,
      required: false,
      default: false,
    },

  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.pre("save", async function (this: any, next: any) {
  if (this.isNew || this.isModified("otp")) {
    this.otp = await helper.generateOTP();
  }
  next();
});

export const User = mongoose.model("users", userSchema);

