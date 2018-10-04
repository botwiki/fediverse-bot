var express = require('express'),
    router = express.Router(),
    ColorScheme = require('color-scheme'),
    generators = {
     triangular_mesh: require(__dirname + '/../generators/triangular-mesh.js')
    },    
    grammar = require(__dirname + '/../tracery/tracery.js').grammar,
    helpers = require(__dirname + '/../helpers/general.js'),    
    image_uploader = require(__dirname + '/../helpers/image-uploader.js'),    
    bot = require(__dirname + '/../bot.js');

router.get('/', function (req, res) {
  var content = grammar.flatten("#origin#"),
      scheme = new ColorScheme;
  
/*
  See https://www.npmjs.com/package/color-scheme#schemes on how to use ColorScheme.
*/

  scheme.from_hex(helpers.get_random_hex().replace('#',''))
        .scheme('mono')
        .variation('hard');

  generators.triangular_mesh({
    width: 800,
    height: 360,
    colors: scheme.colors()
  }, function(err, img_data){
    // console.log({img_url: `${bot.bot_url}/${img_data.path}`});
    
    var img_name = img_data.path.replace('img/', '');
        
    image_uploader.upload_image(img_data, function(err, img_url, data){
      if (err){
        console.log(err);
      } else {
        // console.log(img_url);

        bot.create_post({
          type: 'Note',    
          content: content,
          attachment: [
            {
              url: img_url,
              content: content // Image description here.
            }
          ]
        }, function(err, message){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(message));
        });  
      }
    });
  });
});

module.exports = router;
