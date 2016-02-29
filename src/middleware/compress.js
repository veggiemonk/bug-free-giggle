import compress from 'koa-compress';

export default compress( {
  /*filter: content_type => {
   return /text|json|javascript/i.test(content_type);
   },*/
  threshold: 2048,
  flush:     require( 'zlib' ).Z_SYNC_FLUSH
} )
