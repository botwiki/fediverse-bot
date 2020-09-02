const express = require( 'express' ),
      router = express.Router(),
      moment = require( 'moment' ),
      bot = require( __dirname + '/../bot/bot.js' ),
      db = require( __dirname + '/../helpers/db.js' );

router.get( '/:id',  function( req, res ) {
  let isAdmin = req.session.is_admin,
      postID = req.params.id;
  
  if ( isAdmin ){
    if ( postID === 'all' ){
      console.log( {
        'delete post': 'all of them'
      } );
      
      db.getPosts( { limit: 0 }, function( err, data ){
        if ( err ){
          console.log( err );
        } else {
          if ( data && data.posts && data.posts.length > 0 ){
            data.posts.forEach( function( post ){
              db.deletePost( post.id, bot, function( err ){
                if ( err ){
                  console.log( `error deleting post ${ post.id }`, err );
                } else {
                  console.log( `deleted post ${ post.id }` );
                }
              } );
            } );
          }
        }
      } );

      /* TODO: Use promises to redirect after all posts are deleted. */

      res.redirect( '/' );      
      
    } else {
      console.log( {
        'delete post': postID
      } );

      db.deletePost( postID, bot, function( err ){
        if ( err ){
          console.log( `error deleting post ${postID}`, err );
        } else {
          console.log( `deleted post ${postID}` );
        }
      } );
      res.redirect( '/' );      
    }
  }
  else{
    res.redirect( '/admin' );
  }  
} );

module.exports = router;
