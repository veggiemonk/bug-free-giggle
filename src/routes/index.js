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
  allTranslation } from './translation';
import { getMapping, getAllMapping, updateKeyTranslation } from './key_translation';

// Define rules for each route
router.post( '/', root );

// Keys
router.get( '/key/:id', getKey );
router.get( '/key', getAllKeys );
router.post( '/key', setKey );

// Mapping
router.get( '/mapping', getAllMapping );
router.get( '/mapping/:id', getMapping );
router.post( '/mapping', updateKeyTranslation );

// Translation
router.get( '/translation', allTranslation );
router.get( '/translation/:id', getTranslation );
router.post( '/translation', updateTranslation );



