import { logger } from '../utils/logger';
import productModel from '../models/product.models';
import ProductType from '../types/product.type';

export const getProductFromDb = async () => {
  return await productModel
    .find()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      logger.info('Error get product from db');
      logger.error(err);
    });
};

export const addProductToDb = async (payload: ProductType) => {
  return await productModel
    .create(payload)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      logger.info('Error add product to db');
      logger.error(err);
    });
};

export const getProductById = async (id: string) => {
  return await productModel.findOne({ product_id: id }).then((result) => {
    return result;
  });
};

export const updateProductById = async (id: string, payload: ProductType) => {
  return await productModel.findOneAndUpdate({ product_id: id }, payload).then((result) => {
    return result;
  });
};

export const deleteProductById = async (id: string) => {
  return await productModel.findOneAndDelete({ product_id: id }).then((result) => {
    return result;
  });
};
