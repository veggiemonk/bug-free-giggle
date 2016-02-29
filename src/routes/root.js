// default route
export function * root( next ) {

  this.body = '<div>Root route</div>';
  this.type = 'text/html';
  yield next;
}
