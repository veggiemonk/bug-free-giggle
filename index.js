require( 'babel-register' );
require( 'babel-polyfill' );

// Setup the node environment to global application context
global.__DEV_MODE__ = process.env.NODE_ENV !== 'production';
global.__PORT__     = process.env.PORT ? process.env.PORT : 3000;

// export for test engine - mocha
module.exports = exports = require( './src' );
