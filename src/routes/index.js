import koaRouter from 'koa-router';
// Export the koa-router functions
export const router = koaRouter();

// Import the generator functions from each route
import { root } from './root';

// Define rules for each route
router.get( '/v1/', root );

