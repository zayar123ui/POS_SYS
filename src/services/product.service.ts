
import { HttpError } from "../helper/helper";
import { Product } from "../models/product.model";

export const addProductSvc = async (
  name: string,
  price: number,
  type: string
) => {
  try {
    const product = await Product.findOne({ name });
    if (product) {
      throw new HttpError("Product already exists", 400);
    }
    const newProduct = await Product.create({
      name,
      price,
      type,
    });
    return newProduct;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
