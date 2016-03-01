import koaRouter from 'koa-router';

// Export the koa-router functions
export const router = koaRouter( {
  prefix: '/v1'
} );

// Import the generator functions from each route
import { root } from './root';
import { getKey } from './key';
import { getTranslation } from './translation';

// Define rules for each route
router.post( '/', root );
router.get( '/key', getKey );
router.get( '/translation', getTranslation );

