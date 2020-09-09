if ( !process.env.PROJECT_NAME || !process.env.PROJECT_ID ){
  require( 'dotenv' ).config();
}

const fs = require('fs'),
      crypto = require('crypto'),
      url = require('url'),
      util = require('util'),
      moment = require('moment'),
      dbHelper = require(__dirname + '/../helpers/db.js'),
      keys = require(__dirname + '/../helpers/keys.js'),
      request = require('request'),
      public_key_path = '.data/rsa/pubKey',
      private_key_path = '.data/rsa/privKey',
      bot_url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`,
      botComposeReply = require(__dirname + '/responses.js');

if (!fs.existsSync(public_key_path) || !fs.existsSync(private_key_path)) {
  keys.generateKeys(function(){
    process.kill(process.pid);
  });
}
else{
  var public_key = fs.readFileSync(public_key_path, 'utf8'),
      private_key = fs.readFileSync(private_key_path, 'utf8'); 

  module.exports = {
    bot_url: bot_url,
    links: [
        // {
        //   rel: 'http://webfinger.net/rel/profile-page',
        //   type: 'text/html',
        //   href: `${bot_url}`
        // },
        // {
        //   rel: 'http://schemas.google.com/g/2010#updates-from',
        //   type: 'application/atom+xml',
        //   href: `${bot_url}/feed`
        // },
        {
          rel: 'self',
          type: 'application/activity+json',
          href: `${bot_url}/bot`
        },
        // {
        //   rel: 'hub',
        //   href: `${bot_url}/pubsub`
        // },
        // {
        //   rel: 'salmon',
        //   href: `${bot_url}/salmon`
        // },
        // {
        //   rel: 'magic-public-key',
        //   href: `data:application/magic-public-key,RSA.${public_key.replace('-----BEGIN PUBLIC KEY-----\n', '').replace('\n-----END PUBLIC KEY-----', '').replace('\\n', '')}`
        // }      
      ],      
    info: {
      '@context': [
          'https://www.w3.org/ns/activitystreams',
          'https://w3id.org/security/v1'
      ],
      'id': `${bot_url}/bot`,
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
      'inbox': `${bot_url}/inbox`,
      'publicKey': {
          'id': `${bot_url}/bot#main-key`,
          'owner': `${bot_url}/bot`,
          'publicKeyPem': public_key
      }
    },
    script: require( __dirname + '/script.js' ),
    composeReply: botComposeReply,
    sendReply: function(options, cb){
      var bot = this,
          reply_to_username = '';

      try{
        var actor_url_parts = options.payload.actor.split('/');
        var username = actor_url_parts[actor_url_parts.length-1];
        reply_to_username = `@${username}@${url.parse(options.payload.actor).hostname} `;

        console.log({reply_to_username});  
      } catch(err){ /*noop*/ }
      
      bot.createPost({
        type: 'Note',
        content: `<blockquote>${options.payload.object.content}<cite><a href="${options.payload.object.url}">${options.payload.object.url}</a></cite></blockquote><p>${options.reply_message}</p>`,
        reply_message: `<a href="${options.payload.actor}">${reply_to_username}</a> ${options.reply_message}`,
        in_reply_to: options.payload.object.url
      }, function(err, message){
        // console.log(err, message);
      });
    },
    createPost: function(options, cb){
      var bot = this;

      if ((!options.content || options.content.trim().length === 0 ) && !options.attachment ){
        console.log('error: no post content or attachments');
        return false;
      }

      var post_type = options.type || 'Note',
          post_description = options.description,
          post_date = moment().format(),
          post_in_reply_to = options.in_reply_to || null,
          reply_message = options.reply_message || null,
          post_content = options.content || options.url || '',
          post_attachment = JSON.stringify(options.attachment) || '[]';
      
      dbHelper.savePost({
        type: post_type,
        content: post_content,
        attachment: post_attachment
      }, function(err, data){
        var post_id = data.lastID;
        
        var post_object;
        
        if ( post_type === 'Note' ){
          post_object = {
            'id': `${bot_url}/post/${post_id}`,
            'type': post_type,
            'published': post_date,
            'attributedTo': `${bot_url}/bot`,
            'content': reply_message || post_content,
            'to': 'https://www.w3.org/ns/activitystreams#Public'
          };
          
          if (options.attachment){
            var attachments = [];

            options.attachment.forEach(function(attachment){
              attachments.push({
                'type': 'Image',
                'content': attachment.content,
                'url': attachment.url
              });
            });
            post_object.attachment = attachments;
          }
        }
        
       if (post_in_reply_to){
          post_object.inReplyTo = post_in_reply_to;  
       }        
        
        var post = {
          '@context': 'https://www.w3.org/ns/activitystreams',
          'id': `${bot_url}/post/${post_id}`,
          'type': 'Create',
          'actor': `${bot_url}/bot`,
          'object': post_object
        }

        console.log({post_in_reply_to});

        dbHelper.getFollowers(function(err, followers){
          if (followers){
            console.log(`sending update to ${followers.length} follower(s)...`);

            followers.forEach(function(follower){
              if (follower.url){
                bot.signAndSend({
                  follower: follower,
                  message: post
                }, function(err, data){

                });
              }
            });
          }
        });

        if (cb){
          cb(null, post);
        }
      });
    },
    deletePost: function(post_id, follower_url, cb){
        var bot = this;
            // guid = crypto.randomBytes(16).toString('hex');

        bot.signAndSend({
          follower: {
            url: follower_url
          },
          message: {
            '@context': 'https://www.w3.org/ns/activitystreams',
            // 'summary': `${bot} deleted a post`,
            // 'id': `${bot.bot_url}/${guid}`,
            'type': 'Delete',
            'actor': `${bot.bot_url}/bot`,
            'object': `${bot.bot_url}/post/${post_id}`
          }
        }, function(err, data){
            if (cb){
                cb(err, data);
            }
        });
    },    
    accept: function(payload, cb){
      var bot = this,
          guid = crypto.randomBytes(16).toString('hex');

      dbHelper.getEvent(payload.id, function(err, data){
        // console.log('get_event', err, data);


        bot.signAndSend({
          follower: {
            url: payload.actor
          },
          message: {
            '@context': 'https://www.w3.org/ns/activitystreams',
            'id': `${bot.bot_url}/${guid}`,
            'type': 'Accept',
            'actor': `${bot.bot_url}/bot`,
            'object': payload,
          }
        }, function(err, data){
            if (cb){
                cb(err, payload, data);
            }
          console.log('saving event', payload.id)
          dbHelper.saveEvent(payload.id);
        });

      });
//       dbHelper.getEvent(payload.id, function(err, data){
//         console.log('get_event', err, data);
        
//         if (!err && !data){
//           bot.signAndSend({
//             follower: {
//               url: payload.actor
//             },
//             message: {
//               '@context': 'https://www.w3.org/ns/activitystreams',
//               'id': `${bot.bot_url}/${guid}`,
//               'type': 'Accept',
//               'actor': `${bot.bot_url}/bot`,
//               'object': payload,
//             }
//           }, function(err, data){
//               if (cb){
//                   cb(err, payload, data);
//               }
//             console.log('saving event', payload.id)
//             dbHelper.saveEvent(payload.id);
//           });
//         } else if (!err){
//           console.log('duplicate event');
//         }
//       });
    },
    signAndSend: function(options, cb){
      var bot = this;
      // console.log('message to sign:');
      // console.log(util.inspect(options.message, false, null, true));
      
      options.follower.url = options.follower.url.replace('http://localhost:3000', 'https://befc66af.ngrok.io');

      if (options.follower.url && options.follower.url !== 'undefined'){
        options.follower.domain = url.parse(options.follower.url).hostname;

        var signer = crypto.createSign('sha256'),
            d = new Date(),
            string_to_sign = `(request-target): post /inbox\nhost: ${options.follower.domain}\ndate: ${d.toUTCString()}`;

        signer.update(string_to_sign);
        signer.end();
        
        var signature = signer.sign(private_key);
        var signature_b64 = signature.toString('base64');
        var header = `keyId="${bot_url}/bot",headers="(request-target) host date",signature="${signature_b64}"`;
      
        var req_object = {
          url: `https://${options.follower.domain}/inbox`,
          headers: {
            'Host': options.follower.domain,
            'Date': d.toUTCString(),
            'Signature': header
          },
          method: 'POST',
          json: true,
          body: options.message
        };
        
        // console.log('request object:');
        // console.log(util.inspect(req_object, false, null, true));        

        request(req_object, function (error, response){
          console.log(`sent message to ${options.follower.url}...`);
          if (error) {
            console.log('error:', error, response);
          }
          else {
            console.log('response:', response.statusCode, response.statusMessage);
            // console.log(response);
          }
          
          if (cb){
            cb(error, response);
          }
        });
      }
    }
  };
}
