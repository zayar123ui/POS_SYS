import { Request, Response } from "express";
import { HttpError, response } from "../../helper/helper";
import {
  getProductsSvc,
  buyProductSvc,
  getPurchaseHistorySvc
} from "../../services/user/product.service";
import { set_cache_string ,get_cache_string} from "../../helper/cache";

export const buyProduct = async (req: Request, res: Response) => {
  try {
    const { product_id,coupon_id } = req.body;
    const user_id = req.user.userId;
    const product = await buyProductSvc(product_id,coupon_id,user_id);
    return response.success(res, 200, "Product bought successfully", product);
  } catch (error) {
    if (error instanceof HttpError) {
      return response.fail(res, error.statusCode, error.message);
    } else {
      return response.internal(res, 500, "Internal server error", error);
    }
  }
};

export const productList = async (req: Request, res: Response) => {
  try {
    const products = await getProductsSvc();
    return response.success(res, 200, "Product List Fetch successfully", products);
  } catch (error) {
    console.log(error);
    return response.internal(
      res,
      500,
      "Internal server error.",
      error as unknown as string
    );
  }
};

export const purchaseHistory = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.userId;
    const cachedData = await get_cache_string(`purchaseHistory-${user_id}`);
    if(cachedData){
      return response.success(res, 200, "Purchase History Fetch successfully", cachedData);
    }
    const products = await getPurchaseHistorySvc(user_id);
    
    await set_cache_string(`purchaseHistory-${user_id}`, JSON.stringify(products));

    return response.success(
      res,
      200,
      "Purchase History Fetch successfully",
      products
    );
  } catch (error) {
    console.log(error);
    return response.internal(
      res,
      500,
      "Internal server error.",
      error as unknown as string
    );
  }
};
