const fs = require( 'fs' ),
      bot = require( __dirname + '/../bot/bot.js' ),
      NeoCities = require( 'neocities' );

let useNeocities = false;

if ( process.env.NEOCITIES_USERNAME && process.env.NEOCITIES_PASSWORD ){
  const neocitiesAPI = new NeoCities( process.env.NEOCITIES_USERNAME, process.env.NEOCITIES_PASSWORD );
  useNeocities = true;
}

module.exports = {
  uploadImage: function( img_data, cb ){
    let img_url = `${bot.bot_url}/${img_data.path}`,
        img_name = img_data.path.replace( 'img/', '' );
      
    if ( useNeocities ){
      /*
      First option, NeoCities. They offer 1GB for free, and with a 
      paid option ( $5/month ) you get 50GB.
      
      https://neocities.org/supporter

      */
      neocitiesAPI.upload( [ {
          name: img_name,
          path: `.data/img/${img_name}`
        } ], function( resp ) {
        console.log( resp );
        img_url = null;
        
        if ( resp && resp.result === 'success' ){
          fs.unlink( `.data/img/${img_name}`, function( err ){
            if ( err ){
              console.log( err );
            }
            else{
              console.log( 'deleted local image' );
            }
          } );
          
          img_url = `https://${process.env.NEOCITIES_USERNAME}.neocities.org/${img_name}`;
        }
        if ( cb ){
          cb( null, img_url, resp );
        }
      } );
    } else {
      /* Fall-back to local storage. It's only ~128 MB, so good luck! */
      if ( cb ){
        cb( null, img_url );
      }
    }
  }
};



