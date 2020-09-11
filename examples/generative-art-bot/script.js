const express = require( 'express' ),
      helpers = require( __dirname + '/../helpers/general.js' ),
      ColorScheme = require('color-scheme'),
      generators = {
        triangular_mesh: require(__dirname + '/../generators/triangular-mesh.js')
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

  generators.triangular_mesh( {
    width: 800,
    height: 360,
    colors: scheme.colors()
  }, function( err, imgData ){
    console.log( 'posting new image...', { imgUrl: `${ bot.bot_url }/${ imgData.path }` } );

    var imgName = imgData.path.replace( 'img/', '' );
        
    bot.createPost( {
      type: 'Note',    
      content: content,
      attachment: [
        {
          url: bot.bot_url,
          content: 'Abstract art' // Image description here.
        }
      ]
    }, function( err, message ){
      if ( err ){
        console.log( err );
      }
    } );  
  } );
};
