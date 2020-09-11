const express = require( 'express' ),
      helpers = require( __dirname + '/../helpers/general.js' ),
      ColorScheme = require('color-scheme'),
      colorbrewerColors = require( __dirname + '/../helpers/colorbrewer.js' ),
      generators = {
        joy_division: require(__dirname + '/../generators/joy-division.js')
      },    
      grammar = require( __dirname + '/../tracery/tracery.js' ).grammar;

module.exports = function(){
  const bot = require( __dirname + '/bot.js' ),
        content = grammar.flatten( '#origin#' ),
        scheme = new ColorScheme;
  
  /* See https://www.npmjs.com/package/color-scheme#schemes on how to use ColorScheme. */

  scheme.from_hex( helpers.getRandomHex().replace( '#','' ) )
        .scheme( 'mono' )
        .variation( 'soft' );

  generators.joy_division( {
    width: 640,
    height: 480,
    colors: helpers.randomFromArray( colorbrewerColors ),
    animate: true,
    save: true
  }, function( err, imgURL ){
    console.log( 'posting new image...', imgURL );
        
    bot.createPost( {
      type: 'Note',    
      // content: content,
      attachment: [
        {
          url: imgURL,
          content: content // Image description here.
        }
      ]
    }, function( err, message ){
      if ( err ){
        console.log( err );
      }
    } );  
  } );
};
