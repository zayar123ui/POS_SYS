import { User } from "../models/user.model";
import { helper } from "../helper/helper";
import { HttpError } from "../helper/helper";
import jwt from "jsonwebtoken";
import { UserWallet } from "../models/userWallet.model";
import { UserRole } from "../enums/user.enum";

export const loginSvc = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpError("User not found", 404);
    }
    if (!user.verified) {
      throw new HttpError("User not verified. Please verify your account", 403);
    }
    const decryptedPassword = await helper.decrypt(user.password);
    if (decryptedPassword !== password) {
      throw new HttpError("Invalid password", 403);
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return { token };
  } catch (error: any) {
    throw error;
  }
};

export const verifySvc = async (email: string, otp: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpError("User not found", 404);
    }
    if (user.otp !== otp) {
      throw new HttpError("Invalid OTP", 403);
    }
    user.verified = true;
    user.otp = null;
    await user.save();
  } catch (error: any) {
    throw error;
  }
};

export const registerSvc = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
) => {
  try {
    const hashedPassword = await helper.encrypt(password);

    const user = await User.findOne({ email });
    if (user) {
      throw new HttpError("User already exists", 400);
    }
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await helper
      .generateQRCode(newUser._id.toString())
      .then(async (base64Svg) => {
        await User.findByIdAndUpdate(newUser._id, { qrCode: base64Svg });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    if (newUser.role === UserRole.USER) {
      await UserWallet.create({
        user_id: newUser._id,
        point: 0,
      });
    }

    return newUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
