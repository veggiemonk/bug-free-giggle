import koaRouter from 'koa-router';

// Export the koa-router functions
export const router = koaRouter( {
  prefix: '/v1'
} );

// Import the generator functions from each route
import { root } from './root';
import { addKey, getKey, setKey, getAllKeys } from './key';
import {
  addTranslation,
  getTranslation,
  updateTranslation,
  getAllTranslation } from './translation';
import { addMapping, getMapping, getAllMapping, updateMapping } from './key_translation';

// Define rules for each route
router.post( '/', root );

/**
 -------------
 -- PATTERN --
 -------------
 1. ADD
 2. GET
 3. GET ALL
 4. UPDATE

 Question ?
 - DELETE one ?
 - ADD many?
 - UPDATE many?
 - DELETE many ?
 */

// Keys
router.put( '/key', addKey );
router.get( '/key/:id', getKey );
router.get( '/key', getAllKeys );
router.post( '/key', setKey );

// Mapping
router.put( '/mapping', addMapping );
router.get( '/mapping/:id', getMapping );
router.get( '/mapping', getAllMapping );
router.post( '/mapping', updateMapping );


// Translation
router.put( '/translation', addTranslation );
router.get( '/translation/:id', getTranslation );
router.get( '/translation', getAllTranslation );
router.post( '/translation', updateTranslation );




