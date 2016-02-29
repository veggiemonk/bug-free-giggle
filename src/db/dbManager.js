var oracledb = require( 'oracledb' );
var dbConfig = require( './dbconfig.js' );

var rowCount    = 0;
var queryOption = { resultSet: true, outFormat: oracledb.OBJECT };

var connect = function () {
  return new Promise( function ( resolve, reject ) {
    oracledb.getConnection(
      {
        user:          dbConfig.user,
        password:      dbConfig.password,
        connectString: dbConfig.connectString
      },
      function ( err, connection ) {
        if ( err ) {
          console.error( "Connection", err.message );
          reject( err );
        }
        resolve( connection );
      } );
  } );
};

var executeQuery = function ( query ) {
  return new Promise( function ( resolve, reject ) {
    connect().then( connection=> {
      connection.execute( query,
        [], // no bind variables
        queryOption, // return a result set.  Default is false
        function ( err, result ) {
          if ( err ) {
            console.error( "executeQuery", err.message );
            doRelease( connection );
            reject( err );
          }
          //console.log(result);
          //fetchOneRowFromRS(connection, result.resultSet);
          resolve( result );
        } )
    } ).catch( err=>reject( err ) )
  } );
};

var getResult = function ( query ) {
  return new Promise( function ( resolve, reject ) {
    executeQuery( query )
      .then( function ( result ) {
        console.log( "executeQuery ends with succes" );
        fetchRow( result.resultSet ).then( ( r ) => {
          console.log( "fetchRow ends with succes" );
          resolve( r );
        } ).catch( ( err )=> {
          reject( err )
        } );
      } )
      .catch( ( err )=>reject( err ) );
  } );
};

var fetchRow = function ( resultSet ) {
  return new Promise( function ( resolve, reject ) {
    resultSet.getRow( // get one row
      function ( err, row ) {
        if ( err ) {
          console.error( "fetchRow", err.message );
          reject( err );
          doClose( resultSet ); // always close the result set
        } else if ( !row ) {
          resolve( false );                // no rows, or no more rows
          doClose( resultSet ); // always close the result set
        } else {
          fetchRow( resultSet )
            .then( ( r ) => {
              if ( r === false ) {
                r = [];
              }
              r.push( row );
              resolve( r )
            } );
        }
      } );
  } );
}

function doRelease() {
  return connect().then( connection=> {
    connection.release(
      function ( err ) {
        if ( err ) {"doRelease", console.error( err.message ); }
      } );
  } );
}

function doClose( resultSet ) {
  return connect().then( connection=> {
    resultSet.close(
      function ( err ) {
        if ( err ) { console.error( err.message ); }
        doRelease( connection );
      } );
  } );
}

//module.exports = { getResult: getResult }
export default getResult
