import getResult from '../db/dbManager';
import parse from 'co-body';


export function * addMapping( next ) {
  // parse body for param
  const body = yield parse.json( this, { limit: '1000kb' } );
  if ( !body.data ) this.throw( 400, '"key" and "translation" param required' );
  console.log( 'data:', body.data );
  const {key, translation} = body.data;
  if ( !key || !Number.isInteger( key ) || !translation || !Number.isInteger( translation ) ) {
    this.throw( 400, `Bad Param, key = ${key}, translation = ${translation}` );
  }
  const id = '8484' + getRandomInt( 0, 999999 );
  const sql = ` INSERT INTO I18N_KEY_TRANSLATION VALUES ( ${id}, ${key}, ${translation}) `;
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
export function * getMapping( next ) {
  const body = yield parse.json( this, { limit: '1000kb' } );
  if ( !body.data ) this.throw( 400, 'ID required' );
  console.log( 'data:', body.data );
  const {id} = body.data;
  if ( !id && Number.isInteger( id ) ) this.throw( 400, `Bad Param, ID = ${id}` );

  const sql = ` SELECT *
  FROM I18N_KEY_TRANSLATION KT, I18N_KEY K, I18N_TRANSLATION T
   WHERE KT.ID_KEY = K.ID
    AND KT.ID_TRANSLATION = T.ID
    AND KT.ID = ${id} `;

  let result;
  try {
    result = yield getResult( sql );
  } catch ( ex ) {
    result = `ERROR: ${ ex }`;
  }

  __DEV_MODE__ && console.log( result );

  this.body = result;
  this.type = 'json';
  yield next;
}

//-------------------------------------------------------
export function * getAllMapping( next ) {

  const sql = ` SELECT *
  FROM I18N_KEY_TRANSLATION KT, I18N_KEY K, I18N_TRANSLATION T
   WHERE KT.ID_KEY = K.ID
    AND KT.ID_TRANSLATION = T.ID `;
  __DEV_MODE__ && console.log( sql );

  let result;
  try {
    result = yield getResult( sql );
  } catch ( ex ) {
    result = `ERROR: ${ ex }`;
  }

  __DEV_MODE__ && console.log( result );

  this.body = result;
  this.type = 'json';
  yield next;

}


//-------------------------------------------------------
export function * updateMapping( next ) {
  this.body = 'KO';
}
