const fs = require( 'fs' ),
      url = require( 'url' ),
      util = require( 'util' ),
      bot = require( __dirname + '/../bot/bot.js' ),
      express = require( 'express' ),
      router = express.Router(  );

router.all( '/', function( req, res ) {
  const urlParts = url.parse( req.url, true );

  console.log( '/outbox', urlParts );

  res.setHeader( 'Content-Type', 'application/json' );
  res.send( JSON.stringify( {
    error: null
  } ) );
} );

module.exports = router;
