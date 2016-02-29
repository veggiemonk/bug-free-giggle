import getResult from '../db/dbManager';

const sql = 'select * from i18n_translation t where t.id in (select id from i18n_key)';

export function * root( next ) {

  const result = yield getResult( sql );
  this.body = result
    ? `<div style="background-color: pink;>${JSON.stringify(result)}</div>`
    : `<div style="background-color: red;">ERROR: ${result}</div>`

  this.type = 'text/html';
  yield next;
}
