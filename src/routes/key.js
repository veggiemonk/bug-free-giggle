import getResult from '../db/dbManager';
import parse from 'co-body';


export function * addKey( next ) {

  const body = yield parse.json( this, { limit: '1000kb' } );
  if ( !body.data ) this.throw( 400, '"data" param required' );
  console.log( 'data:', body.data );
  const {key} = body.data;
  if ( !key || Number.isInteger( key ) ) this.throw( 400, `Bad Param, key = ${key}` );
  const id = '8484' + getRandomInt( 0, 999999 );
  const sql = ` INSERT INTO I18N_KEY VALUES ( ${id}, ${key}) `;
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
export function * getKey( next ) {

  const {id} = this.params;
  const keyID = Number( id );
  if ( Number.isNaN( keyID ) ) yield next;
  const sql = ` SELECT * from I18N_KEY K WHERE K.ID = ${id} `;
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
export function * getAllKeys( next ) {

  const sql = ' SELECT * FROM I18N_KEY K ';
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
export function * setKey( next ) {
  this.body = 'KO';
}

