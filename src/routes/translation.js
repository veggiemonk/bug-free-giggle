import getResult from '../db/dbManager';
import parse from 'co-body';


export function * addTranslation( next ) {

  const body = yield parse.json( this, { limit: '1000kb' } );
  if ( !body.data ) this.throw( 400, '"data" param required' );
  console.log( 'body:', body );
  const {translation} = body.data;
  if ( !translation ) this.throw( 400, `Bad Param, translation = ${translation}` );
  const id = '8484' + getRandomInt( 0, 999999 );
  const sql = ` INSERT INTO I18N_TRANSLATION (ID, EN, FR, NL, DE)
  VALUES ( ${id}, ${translation.en}, ${translation.fr}, ${translation.nl}, ${translation.de}) `;
  __DEV_MODE__ && console.log( sql );

  if ( body.fake ) {
    this.body = sql;
    this.type = 'text';
    yield next;
  }

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
//TODO: replace with sequence!!!!
function getRandomInt( min, max ) {
  return Math.floor( Math.random() * (max - min) ) + min;
}

//-------------------------------------------------------
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

//-------------------------------------------------------
export function * getAllTranslation( next ) {

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

//-------------------------------------------------------
export function * updateTranslation( next ) {
  // parse body for param (keys)
  const body = yield parse.json( this, { limit: '1000kb' } );
  if ( !body.data ) this.throw( 400, '.data required' );
  //update all keys with SQL
  console.log( 'data:', body.data );

  this.body = 'OK';
  yield next;
}
