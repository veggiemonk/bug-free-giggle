import getResult from '../db/dbManager';
import parse from 'co-body';


export function * getTranslation( next ) {

  const {id} = this.params;
  const keyID = Number( id );
  if ( Number.isNaN( keyID ) ) this.throw( 400, `Bad Param, id = ${id}` );
  const sql = ` SELECT * from I18N_TRANSLATION T WHERE T.ID = ${id} `;
  __DEV_MODE__ && console.log( sql );

  let result;
  try {
    result = yield getResult( sql );
  } catch ( ex ) {
    result = `ERROR: ${ ex }`;
  }

  this.body = result;
  this.type = 'json';
  yield next;
}

export function * updateTranslation( next ) {
  // parse body for param (keys)
  const body = yield parse.json( this, { limit: '1000kb' } );
  if ( !body.data ) this.throw( 400, '.data required' );
  //update all keys with SQL
  console.log( 'data:', body.data );

  this.body = 'OK';
  yield next;
}


export function * allTranslation( next ) {

  const sql = ' SELECT * FROM I18N_TRANSLATION';

  let result;
  try {
    result = yield getResult( sql );
  } catch ( ex ) {
    result = `ERROR: ${ ex }`;
    console.log( `ERROR: ${ ex }` );
  }

  this.body = result;
  this.type = 'json';
  yield next;
}

