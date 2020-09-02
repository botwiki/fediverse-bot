const fs = require( 'fs' ),
      url = require( 'url' ),
      util = require( 'util' ),
      bot = require( __dirname + '/../bot/bot.js' ),
      express = require( 'express' ),
      router = express.Router(  );

router.get( '/', function( req, res ) {
  const urlParts = url.parse( req.url, true );
  
  if ( req.headers['user-agent'].indexOf( 'mastodon' ) !== -1 || ( req.query.debug && req.query.debug !== '' ) ){
    res.setHeader( 'Content-Type', 'application/json' );    
    // console.log( bot.info );
    // res.send( JSON.stringify( bot.info ) );
    res.json( bot.info );
  }
  else{
    res.redirect( '/' );
  }
} );

module.exports = router;
