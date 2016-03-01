import getResult from '../db/dbManager';


export function * getKey( next ) {

  if ( 'GET' != this.method ) return yield next;

  const sql = ' SELECT * FROM I18N_KEY K ';


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
  //TODO
  //this.throw( 400, 'key required' )

}
