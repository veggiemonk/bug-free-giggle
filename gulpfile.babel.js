const gulp        = require( 'gulp' );
const browserify  = require( 'browserify' );
const watchify    = require( 'watchify' );
const babelify    = require( 'babelify' );
const rimraf      = require( 'rimraf' );
const source      = require( 'vinyl-source-stream' );
const buffer      = require( 'vinyl-buffer' );
const htmlmin     = require( 'gulp-htmlmin' );
const uglify      = require( 'gulp-uglify' );
const sourcemaps  = require( 'gulp-sourcemaps' );
const sass        = require( "gulp-sass" );
const gutil       = require( 'gulp-util' );
const _           = require( 'lodash' );
const browserSync = require( 'browser-sync' );
const reload      = browserSync.reload;


//TODO: Browserify transform that strips console.log lines from your code https://www.npmjs.org/package/stripify
//TODO: https://github.com/steida/gulp-closure-compiler
const config = {
  entryFile:  './public/index.js',
  entryHTML:  './public/index.html',
  outputDir:  './dist/',
  outputFile: 'app.js',
  outputCSS:  './dist/master.css'
};

//-------------------------------------------------------
// GULP/BROWSERIFY MAIN TASK!
function compile( watch ) {
  const bundler = watchify(
    browserify( config.entryFile, _.extend( { debug: true }, watchify.args ) )
      .transform( "babelify", { presets: [ "es2015", "stage-0" ], plugins: [ "mjsx" ] } )
  );

  function rebundle() {
    bundler.bundle()
      .on( 'error', function ( err ) {
        gutil.log( err );
        this.emit( 'end' );
      } )
      .pipe( source( config.outputFile ) )
      .pipe( buffer() )
      /*.pipe( sourcemaps.init( { loadMaps: true } ) )
      // Add transformation tasks to the pipeline here.
      .pipe( uglify() )
      .pipe( sourcemaps.write( './' ) )*/
      .pipe( gulp.dest( config.outputDir ) )
      .pipe( reload( { stream: true } ) );
  }

  if ( watch ) {
    bundler.on( 'update', function () {
      console.log( '-> bundling...' );
      minHTML();
      rebundle();
    } );
  }
  minHTML();
  rebundle();
}

function watch() { return compile( true ); }

function minHTML() {
  return gulp.src( config.entryHTML )
    .pipe( htmlmin( { collapseWhitespace: true } ) )
    .pipe( gulp.dest( config.outputDir ) );
}

//-------------------------------------------------------

// clean the output directory
gulp.task( 'clean', function ( cb ) {
  return rimraf( config.outputDir, cb );
} );


//-------------------------------------------------------


gulp.task( 'styles', function () {
  gulp.src( 'public/index.scss' )
    .pipe( sass( { sourcemap: true } ).on( 'error', sass.logError ) )
    .pipe( sourcemaps.write( './', {
      includeContent: false,
      sourceRoot:     'public/'
    } ) )
    .pipe( gulp.dest( config.outputDir ) )
    .pipe( browserSync.stream( { match: '**/*.css' } ) );
} );


//-------------------------------------------------------


gulp.task( 'build', [ 'clean', 'styles' ], function () { return compile(); } );


//-------------------------------------------------------
gulp.task( 'watch', [ 'clean', 'styles' ], function () {

  browserSync( {
    server: {
      baseDir: './dist'
    }
  } );

  /*gulp.watch( "public/index.scss", [ 'styles' ] );
   gulp.watch( "public/index.html" ).on( 'change', function() {
   minHTML() &&  reload();
   } );*/

  return watch();
} );
//-------------------------------------------------------

// WEB SERVER
gulp.task( 'serve', function () {
  browserSync( {
    server: {
      baseDir: './dist'
    }
  } );
} );

gulp.task( 'default', [ 'watch' ] );




