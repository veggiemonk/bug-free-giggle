import getResult from '../db/dbManager';


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

export function * setKey( next ) {

  this.body = 'KO';
}

export function * getAllKeys( next ) {
  if ( 'GET' != this.method ) return yield next;

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
