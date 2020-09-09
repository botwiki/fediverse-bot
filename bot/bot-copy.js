const fs = require( 'fs' ),
      crypto = require( 'crypto' ),
      url = require( 'url' ),
      util = require( 'util' ),
      moment = require( 'moment' ),
      dbHelper = require( __dirname + '/../helpers/db.js' ),
      keys = require( __dirname + '/../helpers/keys.js' ),
      request = require( 'request' ),
      publicKeyPath = '.data/rsa/pubKey',
      privateKeyPath = '.data/rsa/privKey',
      botURL = `https://${ process.env.PROJECT_DOMAIN }.glitch.me`,
      botComposeReply = require( __dirname + '/responses.js' );

if ( !fs.existsSync( publicKeyPath ) || !fs.existsSync( privateKeyPath ) ) {
  keys.generateKeys( function(  ){
    process.kill( process.pid );
  } );
}
else{
  let publicKey = fs.readFileSync( publicKeyPath, 'utf8' ),
      privateKey = fs.readFileSync( privateKeyPath, 'utf8' ); 

  module.exports = {
    bot_url: botURL,
    links: [
        // {
        //   rel: 'http://webfinger.net/rel/profile-page',
        //   type: 'text/html',
        //   href: `${ botURL }`
        // },
        // {
        //   rel: 'http://schemas.google.com/g/2010#updates-from',
        //   type: 'application/atom+xml',
        //   href: `${ botURL }/feed`
        // },
        {
          rel: 'self',
          type: 'application/activity+json',
          href: `${ botURL }/bot`
        },
        // {
        //   rel: 'hub',
        //   href: `${ botURL }/pubsub`
        // },
        // {
        //   rel: 'salmon',
        //   href: `${ botURL }/salmon`
        // },
        // {
        //   rel: 'magic-public-key',
        //   href: `data:application/magic-public-key,RSA.${ publicKey.replace( '-----BEGIN PUBLIC KEY-----\n', '' ).replace( '\n-----END PUBLIC KEY-----', '' ).replace( '\\n', '' ) }`
        // }      
      ],      
    info: {
      '@context': [
          'https://www.w3.org/ns/activitystreams',
          'https://w3id.org/security/v1'
      ],
      'id': `${ botURL }/bot`,
      'icon': [{
          'url': process.env.BOT_AVATAR_URL,
          'type': 'Image'
        }],
      'image': [{
          'url': process.env.BOT_AVATAR_URL,
          'type': 'Image'
        }],
      'type': 'Person',
      'name': process.env.BOT_USERNAME,
      'preferredUsername': process.env.BOT_USERNAME,
      'inbox': `${ botURL }/inbox`,
      'publicKey': {
          'id': `${ botURL }/bot#main-key`,
          'owner': `${ botURL }/bot`,
          'publicKeyPem': publicKey
      }
    },
    // script: botScript,
    script: require( __dirname + '/script.js' ),
    composeReply: botComposeReply,
    sendReply: function( options, cb ){
      let bot = this,
          replyToUsername = '';

      try{
        let actor_url_parts = options.payload.actor.split( '/' );
        let username = actor_url_parts[actor_url_parts.length-1];
        replyToUsername = `@${ username }@${ url.parse( options.payload.actor ).hostname } `;

        console.log( {replyToUsername} );  
      } catch( err ){ /*noop*/ }
      
      bot.createPost( {
        type: 'Note',
        content: `<blockquote>${ options.payload.object.content }<cite><a href="${ options.payload.object.url}">${ options.payload.object.url }</a></cite></blockquote><p>${ options.reply_message }</p>`,
        reply_message: `<a href="${ options.payload.actor}">${ replyToUsername }</a> ${ options.reply_message}`,
        in_reply_to: options.payload.object.url
      }, function( err, message ){
        // console.log( err, message );
      } );
    },
    createPost: function( options, cb ){
      let bot = this;

      if ( ( !options.content || options.content.trim(  ).length === 0  ) && !options.attachment  ){
        console.log( 'error: no post content or attachments' );
        return false;
      }

      let post_type = options.type || 'Note',
          post_description = options.description,
          post_date = moment(  ).format(  ),
          post_in_reply_to = options.in_reply_to || null,
          reply_message = options.reply_message || null,
          post_content = options.content || options.url || '',
          post_attachment = JSON.stringify( options.attachment ) || '[]';
      
      dbHelper.savePost( {
        type: post_type,
        content: post_content,
        attachment: post_attachment
      }, function( err, data ){
        let post_id = data.lastID;
        
        let post_object;
        
        if (  post_type === 'Note'  ){
          post_object = {
            'id': `${ botURL }/post/${ post_id }`,
            'type': post_type,
            'published': post_date,
            'attributedTo': `${ botURL }/bot`,
            'content': reply_message || post_content,
            'to': 'https://www.w3.org/ns/activitystreams#Public'
          };
          
          if ( options.attachment ){
            let attachments = [];

            options.attachment.forEach( function( attachment ){
              attachments.push( {
                'type': 'Image',
                'content': attachment.content,
                'url': attachment.url
              } );
            } );
            post_object.attachment = attachments;
          }
        }
        
       if ( post_in_reply_to ){
          post_object.inReplyTo = post_in_reply_to;  
       }        
        
        let post = {
          '@context': 'https://www.w3.org/ns/activitystreams',
          'id': `${ botURL }/post/${ post_id }`,
          'type': 'Create',
          'actor': `${ botURL }/bot`,
          'object': post_object
        }

        console.log( {post_in_reply_to} );

        dbHelper.getFollowers( function( err, followers ){
          if ( followers ){
            console.log( `sending update to ${ followers.length } follower( s )...` );

            followers.forEach( function( follower ){
              if ( follower.url ){
                bot.signAndSend( {
                  follower: follower,
                  message: post
                }, function( err, data ){

                } );
              }
            } );
          }
        } );

        if ( cb ){
          cb( null, post );
        }
      } );
    },
    deletePost: function( post_id, follower_url, cb ){
        let bot = this;
            // guid = crypto.randomBytes( 16 ).toString( 'hex' );

        bot.signAndSend( {
          follower: {
            url: follower_url
          },
          message: {
            '@context': 'https://www.w3.org/ns/activitystreams',
            // 'summary': `${ bot} deleted a post`,
            // 'id': `${ bot.bot_url}/${ guid}`,
            'type': 'Delete',
            'actor': `${ bot.bot_url }/bot`,
            'object': `${ bot.bot_url }/post/${ post_id }`
          }
        }, function( err, data ){
            if ( cb ){
                cb( err, data );
            }
        } );
    },    
    accept: function( payload, cb ){
      let bot = this,
          guid = crypto.randomBytes( 16 ).toString( 'hex' );

      dbHelper.getEvent( payload.id, function( err, data ){
        // console.log( 'get_event', err, data );


        bot.signAndSend( {
          follower: {
            url: payload.actor
          },
          message: {
            '@context': 'https://www.w3.org/ns/activitystreams',
            'id': `${ bot.bot_url }/${ guid }`,
            'type': 'Accept',
            'actor': `${ bot.bot_url }/bot`,
            'object': payload,
          }
        }, function( err, data ){
            if ( cb ){
                cb( err, payload, data );
            }
          console.log( 'saving event', payload.id )
          dbHelper.saveEvent( payload.id );
        } );

      } );
//       dbHelper.getEvent( payload.id, function( err, data ){
//         console.log( 'get_event', err, data );
        
//         if ( !err && !data ){
//           bot.signAndSend( {
//             follower: {
//               url: payload.actor
//             },
//             message: {
//               '@context': 'https://www.w3.org/ns/activitystreams',
//               'id': `${ bot.bot_url }/${ guid }`,
//               'type': 'Accept',
//               'actor': `${ bot.bot_url }/bot`,
//               'object': payload,
//             }
//           }, function( err, data ){
//               if ( cb ){
//                   cb( err, payload, data );
//               }
//             console.log( 'saving event', payload.id )
//             dbHelper.saveEvent( payload.id );
//           } );
//         } else if ( !err ){
//           console.log( 'duplicate event' );
//         }
//       } );
    },
    signAndSend: function( options, cb ){
      let bot = this;
      console.log( 'message to sign:' );
      console.log( util.inspect( options.message, false, null, true ) );
      
      options.follower.url = options.follower.url.replace( 'http://localhost:3000', 'https://befc66af.ngrok.io' );

      if ( options.follower.url && options.follower.url !== 'undefined' ){
        options.follower.domain = url.parse( options.follower.url ).hostname;

        let signer = crypto.createSign( 'sha256' ),
            d = new Date(),
            string_to_sign = `( request-target ): post /inbox\nhost: ${ options.follower.domain}\ndate: ${ d.toUTCString() }`;

        signer.update( string_to_sign );
        signer.end(  );
        
        let signature = signer.sign( privateKey );
        let signatureB64 = signature.toString( 'base64' );
        let header = `keyId="${ botURL }/bot",headers="( request-target ) host date",signature="${ signatureB64 }"`;
      
        let reqObject = {
          url: `https://${ options.follower.domain }/inbox`,
          headers: {
            'Host': options.follower.domain,
            'Date': d.toUTCString(  ),
            'Signature': header
          },
          method: 'POST',
          json: true,
          body: options.message
        };
        
        console.log( 'request object:' );
        console.log( util.inspect( reqObject, false, null, true ) );        

        request( reqObject, function ( error, response ){
          console.log( `sent message to ${ options.follower.url }...` );
          if ( error ) {
            console.log( 'error:', error, response );
          }
          else {
            console.log( 'response:', response.statusCode, response.statusMessage );
            console.log( response.body );
          }
          
          if ( cb ){
            cb( error, response );
          }
        } );
      }
    }
  };
}
