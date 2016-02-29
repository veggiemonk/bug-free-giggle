const gulp        = require( 'gulp' );
const browserify  = require( 'browserify' );
const watchify    = require( 'watchify' );
const babelify    = require( 'babelify' );
const sassr       = require( 'sassr' );
const rimraf      = require( 'rimraf' );
const source      = require( 'vinyl-source-stream' );
const buffer      = require( 'vinyl-buffer' );
const htmlmin     = require( 'gulp-htmlmin' );
const uglify      = require( 'gulp-uglify' );
const sourcemaps  = require( 'gulp-sourcemaps' );
const gutil       = require( 'gulp-util' );
const _           = require( 'lodash' );
const browserSync = require( 'browser-sync' );
const reload      = browserSync.reload;

const config = {
  entryFile:  './public/index.js',
  entryHTML:  './public/index.html',
  outputDir:  './dist/',
  outputFile: 'app.js'
};

// POST CSS
/*var prefixer = postcss([ autoprefixer ]);
 const sassConfig = {
 cssPostProcessor: function(css, callback) {
 prefixer.process(css).then(function(result) {
 callback(null, result);
 });
 },
 outputStyle: 'nested', //nested, expanded, compact, compressed
 sourceComments: (env !== 'production')  // true enables additional debugging information in the output file as CSS comments
 };*/

/*
 //USE IT IN CODE
 var styles = require('./some.scss');
 styles.append();
 */

const bConfig = {
  debug:     true,
  transform: [ "babelify",
    {
      presets: [ "es2015", "stage-0" ],
      plugins: [ "mjsx" ]
    } ],
}

const sassConfig = {
  sourceMap:      true,        // doesn't work ==> how to debug?
  outputStyle:    'nested', //nested, expanded, compact, compressed
  sourceComments: true  // true enables additional debugging information in the output file as CSS comments
}

/*
 ** css-modulesify OPTIONS **
 rootDir: absolute path to your project's root directory. This is optional but providing it will result in better generated classnames. css-modulesify will try to use the browserify basedir if rootDir is not specified, if both are not specified it will use the location from which the command was executed.
 output: path to write the generated css. If not provided, you'll need to listen to the 'css stream' event on the bundle to get the output.
 jsonOutput: optional path to write a json manifest of classnames.
 use: optional array of postcss plugins (by default we use the css-modules core plugins).
 generateScopedName: (API only) a function to override the default behaviour of creating locally scoped classnames.
 * */

// GULP/BROWSERIFY MAIN TASK!
function compile( watch ) {
  const bundler = watchify(
    browserify( config.entryFile, _.extend( { debug: true }, watchify.args ) )
      .transform( "babelify", { presets: [ "es2015", "stage-0" ], plugins: [ "mjsx" ] } )
      //.transform( sassConfig, sassr)
      .plugin( require( 'css-modulesify' ), {
        rootDir: __dirname,
        output:  './dist/master.css'
      } )
  )

  function rebundle() {
    bundler.bundle()
      .on( 'error', function ( err ) {
        gutil.log( err );
        this.emit( 'end' );
      } )
      .pipe( source( config.outputFile ) )
      .pipe( buffer() )
      .pipe( sourcemaps.init( { loadMaps: true } ) )
      // Add transformation tasks to the pipeline here.
      .pipe( uglify() )
      .pipe( sourcemaps.write( './' ) )
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

function watch() { return compile( true ); };

function minHTML() {
  return gulp.src( config.entryHTML )
    .pipe( htmlmin( { collapseWhitespace: true } ) )
    .pipe( gulp.dest( config.outputDir ) );
}

/*function copyLogo() {
  return gulp.src( './public/src/components/logo.svg' ).pipe( gulp.dest( './dist' ) )
}

gulp.task( 'logo', function copyLogo() {
  return gulp.src( './public/src/components/logo.svg' ).pipe( gulp.dest( './dist' ) )
} )*/

// clean the output directory
gulp.task( 'clean', function ( cb ) {
  return rimraf( config.outputDir, cb );
} );

gulp.task( 'build', [ "clean" ], function () { return compile(); } );
gulp.task( 'watch', [ "clean" ], function () {

  browserSync( {
    server: {
      baseDir: './dist'
    }
  } );

  return watch();
} );

// WEB SERVER
gulp.task( 'serve', function () {
  browserSync( {
    server: {
      baseDir: './dist'
    }
  } );
} );

gulp.task( 'default', [ 'watch' ] );




