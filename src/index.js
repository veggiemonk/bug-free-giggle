import koa from 'koa';
import serve from 'koa-static';
import {router} from './routes';
import _ from 'lodash';
import qs from 'koa-qs';
import cors from 'kcors';

// middleware
import compression from './middleware/compress';
import koaBunyanLogger from 'koa-bunyan-logger';
import logger from 'koa-logger';


const app = koa();

app.use( cors() );

qs( app, 'extended' );//query string

app.use( koaBunyanLogger( {
  name:  'i18n_translate',
  level: __DEV_MODE__ ? 'debug' : 'info'
} ) );


if ( __DEV_MODE__ ) {
  app.use( logger() );
} else {
  app.use( koaBunyanLogger.requestLogger() );
}

app.use( compression );

app.use( router.routes() );

app.use( serve( './public' ) );

// export the koa app for test cases
export default app.listen( __PORT__ || 3000 );

if (!module.parent) app.listen(3000);

console.info( `==> Server now is listening on port ${__PORT__}` );
