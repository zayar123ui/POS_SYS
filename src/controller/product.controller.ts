import { Request, Response } from "express";
import { HttpError, response } from "../helper/helper";
import { addProductSvc } from "../services/product.service";
import { ProductType } from "../enums/product.enum";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, type } = req.body;
    isValidType(type);
    const product = await addProductSvc(name, price, type);
    return response.success(
      res,
      200,
      "Product added successfully",
      product
    );
  } catch (error) {

   if (error instanceof HttpError) {
     return response.fail(res, error.statusCode, error.message);
   } else {
     return response.internal(res, 500, "Internal server error", error);
   }
  }
};

const isValidType = (type: string) => {
  if (!Object.values(ProductType).includes(type as ProductType)) {
    throw new HttpError("Invalid type", 400);
  }
};
