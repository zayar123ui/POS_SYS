import { Request, Response } from "express";
import { HttpError, response } from "../helper/helper";
import { registerSvc, loginSvc, verifySvc } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await registerSvc(name, email, password, role);
    return response.success(
      res,
      200,
      "User registered Successfully. Please use the otp code to verify your account.",
      { otp: user.otp }
    );
  } catch (error) {
    console.log(error);
     if (error instanceof HttpError) {
       return response.fail(res, error.statusCode, error.message);
     } else {
       return response.internal(res, 500, "Internal server error", error);
     }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginSvc(email, password);
    return response.success(res, 200, "login successful", user);
  } catch (error: any) {
    if (error instanceof HttpError) {
      return response.fail(res, error.statusCode, error.message);
    } else {
      return response.internal(res, 500, "Internal server error", error);
    }
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await verifySvc(email, otp);
    return response.success(res, 200, "verification successful", user);
  } catch (error: any) {
    if (error instanceof HttpError) {
      return response.fail(res, error.statusCode, error.message);
    } else {
      return response.internal(res, 500, "Internal server error", error);
    }
  }
};
