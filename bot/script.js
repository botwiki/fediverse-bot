const express = require( 'express' ),
      router = express.Router(),
      grammar = require( __dirname + '/../tracery/tracery.js' ).grammar;

module.exports = function(){
  const bot = require( __dirname + '/bot.js' ),
        content = grammar.flatten( '#origin#' );
  
  console.log( 'posting new message...' );

  bot.createPost( {
    type: 'Note', // See www.w3.org/ns/activitystreams#objects
    content: content
  }, function( err, message ){


  } );  
};
