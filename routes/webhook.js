const fs = require( 'fs' ),
      url = require( 'url' ),
      util = require( 'util' ),
      express = require( 'express' ),
      router = express.Router();

router.get( '/', function( req, res ) {
  const urlParts = url.parse( req.url, true );

  console.log( '/webhook', urlParts );

  res.setHeader( 'Content-Type', 'application/json' );
  res.send( JSON.stringify( {
    error: null
  } ) );
} );


module.exports = router;
