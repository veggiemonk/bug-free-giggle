import koaRouter from 'koa-router';

// Export the koa-router functions
export const router = koaRouter( {
  prefix: '/v1'
} );

// Import the generator functions from each route
import { root } from './root';
import { getKey, setKey, getAllKeys } from './key';
import {
  getTranslation,
  updateTranslation,
  updateKeyTranslation,
  allTranslation } from './translation';

// Define rules for each route
router.post( '/', root );

router.get( '/key/:id', getKey );
router.get( '/key', getAllKeys );
router.post( '/key', setKey );

router.get( '/translation/:id', getTranslation );
router.post( '/translation/key', updateKeyTranslation ); //mapping
router.get( '/translation', allTranslation );
router.post( '/translation', updateTranslation );



