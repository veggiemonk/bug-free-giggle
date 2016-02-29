import koa from 'koa';
import serve from 'koa-static';
import {router} from './routes';
import _ from 'lodash';
import he from 'he';
import kat  from './kat';

// middleware
import compression from './middleware/compress';
import koaBunyanLogger from 'koa-bunyan-logger';

// data
const movieList = require( '../test/movieList.json' );

const app    = koa();
const movies = _.map( movieList, ( m )=> Object.assign( m, { name: he.decode( m.name ) } ) );
// test data
/*var movies = [
 {
 "name":    "Blue Jasmine",
 "year":    [ "(2013)", "(2014)" ],
 "imdbURL": "http://www.imdb.com/title/tt2334873/"
 }, {
 "name":    "A nagy f&#xFC;zet",
 "year":    [ "(2013)", "(2014)" ],
 "imdbURL": "http://www.imdb.com/title/tt2324384/"
 }, {
 "name":    "Only Lovers Left Alive",
 "year":    [ "(2013)", "(2014)" ],
 "imdbURL": "http://www.imdb.com/title/tt1714915/"
 } ]*/

function getQueryForTorrent( movies ) {
  return _.map( movies, ( { name, year } ) => {
    return {
      query:     `${name} ${year[ 0 ]}`,
      category:  'movies',
      min_seeds: '1',
      sort_by:   'seeders',
      order:     'desc',
      verified:  1,
      //language: 'en'
    }
  } )
}

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
