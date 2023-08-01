import { Request, Response } from 'express';
import { addProductToDb, deleteProductById, getProductById, getProductFromDb, updateProductById } from '../services/product.service';
import { logger } from '../utils/logger';
import { createProductValidation, updateProductValidation } from '../validations/product.validation';
import { v4 as uuid } from 'uuid';
import { ErrorType } from '../types/error.types';

export const createProduct = async (req: Request, res: Response) => {
  req.body.product_id = uuid();

  const { error, value } = createProductValidation(req.body);
  if (error) {
    throw new ErrorType(error.details[0].message, 422);
  }

  try {
    await addProductToDb(value);
    logger.info('Succes Add Product');
    return res.status(201).json({ status: true, statusCode: 201, message: 'Add Product Success' });
  } catch (error: any) {
    if (error instanceof ErrorType) {
      logger.error('ERR = Add Product', error.message);
      return res.status(error.statusCode).json({ status: false, statusCode: error.statusCode, message: error.message });
    }
    return res.status(500).json({ status: false, statusCode: 500, message: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;
  try {
    if (id) {
      const product = await getProductById(id);
      if (product) {
        logger.info('Product check success');
        return res.status(200).json({ status: true, statusCode: 200, data: product });
      } else {
        throw new ErrorType('Product not found', 404);
      }
    } else {
      const products: any = await getProductFromDb();
      logger.info('Product check success');
      return res.status(200).json({ status: true, statusCode: 200, data: products });
    }
  } catch (error: any) {
    if (error instanceof ErrorType) {
      logger.error('ERR = Get Product', error.message);
      return res.status(error.statusCode).json({ status: false, statusCode: error.statusCode, message: error.message });
    }
    logger.error('ERR = Get Product', error.message);
    return res.status(500).json({ status: false, statusCode: 500, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  const { error, value } = updateProductValidation(req.body);

  try {
    if (error) {
      throw new ErrorType(error.details[0].message, 422);
    }
    const result = await updateProductById(id, value);
    if (!result) {
      logger.error('ERR = Update Product', 'Product not found');
      throw new ErrorType('Product not found', 404);
    }
    logger.info('Succes Update Product');
    return res.status(200).json({ status: true, statusCode: 200, message: 'Update Product Success' });
  } catch (error: any) {
    if (error instanceof ErrorType) {
      logger.error('ERR = Update Product', error.message);
      return res.status(error.statusCode).json({ status: false, statusCode: error.statusCode, message: error.message });
    }
    return res.status(500).json({ status: false, statusCode: 500, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;

  try {
    const result = await deleteProductById(id);
    if (!result) {
      throw new ErrorType('Product not found', 404);
    }
    logger.info('Succes Delete Product');
    return res.status(200).json({ status: true, statusCode: 200, message: 'Delete Product Success' });
  } catch (error: any) {
    if (error instanceof ErrorType) {
      logger.error('ERR = Delete Product', error.message);
      return res.status(error.statusCode).json({ status: false, statusCode: error.statusCode, message: error.message });
    }
    return res.status(500).json({ status: false, statusCode: 500, message: error.message });
  }
};
