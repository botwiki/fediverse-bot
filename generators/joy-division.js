const fs = require( 'fs' ),
      crypto = require('crypto'),
      Canvas = require( 'canvas' ),
      GIFEncoder = require( 'gifencoder' ),
      concat = require( 'concat-stream' ),
      helpers = require(__dirname + '/../helpers/general.js'),
      imgFolder = './.data/img';

  const filePath = `${ imgFolder }/${ helpers.getTimestamp() }-${ crypto.randomBytes( 4 ).toString( 'hex' ) }`,
        filePathGIF = `${ filePath }.gif`,
        filePathPNG = `${ filePath }.png`,
        fileUrl = `https://${ process.env.PROJECT_DOMAIN }.glitch.me/${ filePath.replace( './.data/', '' ) }`,
        fileUrlGIF = `${ fileUrl }.gif`,
        fileUrlPNG = `${ fileUrl }.png`;

module.exports = function( options, cb ) {
  /* 
    Based on http://generativeartistry.com/tutorials/joy-division/
  */
  console.log( 'making waves...' );
  let width = options.width || 640,
      height = options.height || 480,
      colors = options.colors || ['000', 'fff'],
      canvas = Canvas.createCanvas( width, height ),
      ctx = canvas.getContext( '2d' ),
      encoder;
  
  if ( options.animate ){
    encoder = new GIFEncoder( width, height );


    if ( options.save ){
        encoder.createReadStream().pipe( fs.createWriteStream( filePathGIF ) );
    } else {
      encoder.createReadStream().pipe( concat( ( data ) => {
        if ( cb ){
          cb( null, data.toString( 'base64' ) );
        }
      } ) );    
    }

    encoder.start();
    encoder.setRepeat( 0 );   // 0 for repeat, -1 for no-repeat
    encoder.setDelay( 100 );   // frame delay in milliseconds
    encoder.setQuality( 10 ); // image quality, 10 is default.
  }

  ctx.lineWidth = helpers.getRandomInt( 1,4 );
  ctx.fillStyle = colors[0];
  ctx.strokeStyle = colors[1];
  ctx.fillRect( 0, 0, canvas.width, canvas.height );

  if ( options.animate ){
    encoder.addFrame( ctx );
  }
  
  let step = helpers.getRandomInt( 8, 12 );
  let lines = [];

  // Create the lines
  for ( let i = step; i <= height - step; i += step ) {

    let line = [];
    for ( let j = step; j <= height - step; j+= step ) {
      let distanceToCenter = Math.abs( j - height / 2 );
      let variance = Math.max( height / 2 - 50 - distanceToCenter, 0 );
      let random = Math.random() * variance / 2 * -1;
      let point = { x: j+width/2-height/2, y: i + random };
      line.push( point )
    } 
    lines.push( line );
  }

  // Do the drawing
  for ( let i = 0; i < lines.length; i++ ) {

    ctx.beginPath();
    ctx.moveTo( lines[i][0].x, lines[i][0].y )
    for ( var j = 0; j < lines[i].length - 2; j++ ) {
      let xc = ( lines[i][j].x + lines[i][j + 1].x ) / 2;
      let yc = ( lines[i][j].y + lines[i][j + 1].y ) / 2;
      ctx.quadraticCurveTo( lines[i][j].x, lines[i][j].y, xc, yc );
    }

    ctx.quadraticCurveTo( lines[i][j].x, lines[i][j].y, lines[i][j + 1].x, lines[i][j + 1].y );
    ctx.fill();

    ctx.stroke();
    if ( options.animate ){
      encoder.addFrame( ctx );
    }    
  }

  if ( options.animate ){
    encoder.setDelay( 2000 );
    encoder.addFrame( ctx );
    encoder.finish();
    if ( cb ){
      cb( null, fileUrlGIF );

    }
  }
  else{
    if ( options.save ){
      const out = fs.createWriteStream( filePathPNG ),
            stream = canvas.createPNGStream();

      stream.pipe( out );

      out.on( 'finish', function(){
        if ( cb ){
          cb( null, fileUrlPNG );
        }
      } );      
    } else {
      cb( null, canvas.toBuffer().toString( 'base64' ) );
    }
  }
}
