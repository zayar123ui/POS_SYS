import { Product } from "../models/product.model";
import productData from './product.json';

export async function seedProducts() {
  const findProduct = await Product.find();
  if (findProduct.length > 0) {
    return;
  }

  const products = productData.map((data) => {
    return {
      ...data,
    };
  });

  await Product.insertMany(products);
}

