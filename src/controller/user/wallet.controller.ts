import { Request, Response } from "express";
import { HttpError, response } from "../../helper/helper";
import {
  depositSvc,
  getUserPointSvc,
} from "../../services/user/wallet.service";
import { get_cache_string, set_cache_string } from "../../helper/cache";

export const deposite = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const user_id = req.user.userId;

    const product = await depositSvc(amount, user_id);
    return response.success(res, 200, "Deposite successfully", product);
  } catch (error) {
    if (error instanceof HttpError) {
      return response.fail(res, error.statusCode, error.message);
    } else {
      return response.internal(res, 500, "Internal server error", error);
    }
  }
};
export const points = async (req: Request, res: Response) => {
  try {
    
    const user_id = req.user.userId;
    const cachedData = await get_cache_string(`points-${user_id}`);
    if(cachedData){
      console.log("cachedData", cachedData);
      
      return response.success(res, 200, "Point Fetch successfully", {points:cachedData});
    }

    const points = await getUserPointSvc(user_id);

    await set_cache_string(`points-${user_id}`, points.toString());
    return response.success(res, 200, "Point Fetch successfully", {points:points});
  } catch (error) {
    if (error instanceof HttpError) {
      return response.fail(res, error.statusCode, error.message);
    } else {
      return response.internal(res, 500, "Internal server error", error);
    }
  }
};
