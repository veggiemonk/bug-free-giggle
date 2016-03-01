import getResult from '../db/dbManager';


export function * getTranslation( next ) {

  if ( 'GET' != this.method ) return yield next;

  const sql = ' SELECT * FROM I18N_TRANSLATION';


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

export function * setTranslation( next ) {
  //TODO:
}

