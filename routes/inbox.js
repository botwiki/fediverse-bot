const fs = require( 'fs' ),
      url = require( 'url' ),
      crypto = require( 'crypto' ),
      util = require( 'util' ),
      jsdom = require( 'jsdom' ),
      dbHelper = require( __dirname + '/../helpers/db.js' ),
      bot = require( __dirname + '/../bot/bot.js' ),
      { JSDOM } = jsdom,
      express = require( 'express' ),
      router = express.Router(  );

router.post( '/', function ( req, res ) {
  let urlParts = url.parse( req.url, true ),
      payload = req.body;

  console.log( '/inbox' );
  
  console.log( payload.id );

  /*
    TODO: Verify the message.
  */

  if ( payload.type === 'Follow' ){
    
    bot.accept( payload, function( err, payload, data ){
      if ( !err ){
        dbHelper.saveFollower( payload, function( err, data ){
          console.log( `new follower ${payload.actor} saved` ); 
        } );        
      }
      res.status( 200 );
    } );
  }
  else if ( payload.type === 'Undo' ){
    bot.accept( payload, function( err, payload, data ){
      if ( !err ){
        dbHelper.removeFollower( payload, function( err, data ){
          console.log( `removed follower ${payload.actor}` ); 
        } );
      }
      res.status( 200 );
    } );
  }
  else if ( payload.type === 'Create' ){
    bot.accept( payload, function( err, payload, data ){
      if ( !err && payload.object && payload.object.content ){
        let dom = new JSDOM( `<body><main>${payload.object.content}</main></body>` ),
            message_body = '';
        try {
          message_body = dom.window.document.body.firstChild.textContent;

        } catch( err ){ /* noop */}

        bot.composeReply( {
          payload: payload,
          message_from: payload.actor,
          message_body: message_body,
        }, function( err, reply_message ){
          if ( !err ){
            console.log( err );
            console.log( 'sending reply...' );
            bot.sendReply( {
              payload: payload,
              message_body: message_body,
              reply_message: reply_message
            }, function( err, data ){

            } );
          }
        } );
      }
      res.status( 200 );
    } );
  }
  else if ( payload.type === 'Delete' ){
    // console.log( 'payload', payload );  
    console.log( 'Delete /*noop*/' );  
    res.status( 200 );
  }
  else{
    console.log( 'payload', payload );  
    res.status( 200 );
  }
} );

module.exports = router;
