var express = require('express'),
    router = express.Router(),
    ColorScheme = require('color-scheme'),
    generators = {
     triangular_mesh: require(__dirname + '/../generators/triangular-mesh.js')
    },    
    grammar = require(__dirname + '/../tracery/tracery.js').grammar,
    helpers = require(__dirname + '/../helpers/general.js'),    
    bot = require(__dirname + '/../bot.js');

router.get('/', function (req, res) {
  var content = grammar.flatten("#origin#");

  
  var scheme = new ColorScheme;

  scheme.from_hex(helpers.get_random_hex().replace('#',''))
        .scheme('mono')
        .variation('pale');

  generators.triangular_mesh({
    width: 1024,
    height: 100,
    colors: scheme.colors()
  }, function(err, img_data){
    console.log({img_url: `${bot.bot_url}/${img_data.path}`});
    
    bot.create_post({
      content: content,
      thumbnail_url: `${bot.bot_url}/${img_data.path}`
    }, function(err, message){

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(message));
    });
    
  });
});

module.exports = router;
