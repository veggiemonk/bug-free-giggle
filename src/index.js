import koa from 'koa';
import serve from 'koa-static';
import {router} from './routes';
import _ from 'lodash';

// middleware
import compression from './middleware/compress';
import koaBunyanLogger from 'koa-bunyan-logger';

// data
const movieList = require( '../test/movieList.json' );

const app    = koa();

app.use( koaBunyanLogger( {
  name:  'markoa',
  level: __DEV_MODE__ ? 'debug' : 'info'
} ) );
if ( __DEV_MODE__ ) {
  app.use( require( 'koa-logger' )() );
} else {
  app.use( koaBunyanLogger.requestLogger() );
}

app.use( compression );

app.use( router.routes() );

app.use( serve( './public' ) );

// export the koa app for test cases
export default app.listen( __PORT__ || 3000 );

console.info( `==> Server now is listening on port ${__PORT__}` );
