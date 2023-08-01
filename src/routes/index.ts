import { Application, Router } from 'express';
import { authRouter } from './auth.route';
import { healthRouter } from './health.route';
import { productRouter } from './product.route';

const _routes: Array<[string, Router]> = [
  ['/health', healthRouter],
  ['/products', productRouter],
  ['/auth', authRouter],
];

const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [path, router] = route;
    app.use(path, router);
  });
};

export { routes };
