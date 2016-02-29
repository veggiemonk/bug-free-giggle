import getResult from '../db/dbManager';

/*import parse from 'co-body';
 var body = yield parse( this, { limit: '1kb' } );
 if ( !body.name ) this.throw( 400, '.key required' );*/

/* path param ==> this.params
 router.get('/:category/:title', function *(next) {
 console.log(this.params);
 // => { category: 'programming', title: 'how-to-node' }
 });
* */

export function * root( next ) {

  let tkey;
  if ( this.query && this.query.tkey ) {
    ({ tkey } = this.query)
  }else {
    this.throw( 400, 'key required' )
  }

  if ( 'POST' != this.method ) return yield next;

  const sql = `SELECT K.KEY, T.EN, T.FR, T.NL, T.DE
   FROM I18N_TRANSLATION T, I18N_KEY_TRANSLATION KT, I18N_KEY K
    WHERE K.KEY = '${tkey}'
    AND K.ID = KT.ID_KEY
    AND KT.ID_TRANSLATION = T.ID`;

  __DEV_MODE__ && console.log('sql', sql);

  let result;
  try {
    result = yield getResult( sql );
    result = `<div style="background-color: pink;"><ul>
      <li>${result[0].KEY}</li>
      <li>${result[0].EN}</li>
      <li>${result[0].FR}</li>
      <li>${result[0].NL}</li>
      <li>${result[0].DE}</li>
    </ul></div>`
  } catch ( ex ) {
    result = `<div style="background-color: red;">ERROR: ${ ex }</div>`
  }

  this.body = result;
  this.type = 'text/html';
  yield next;
}
