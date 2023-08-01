import { Router } from 'express';
import { requiredAdmin, requiredUser } from '../middleware/auth';
import { createProduct, deleteProduct, getProduct, updateProduct } from '../controllers/product.controller';

export const productRouter: Router = Router();

productRouter.get('/', getProduct);
productRouter.get('/:id', getProduct);
productRouter.post('/', requiredAdmin, createProduct);
productRouter.put('/:id', requiredAdmin, updateProduct);
productRouter.delete('/:id', requiredAdmin, deleteProduct);
