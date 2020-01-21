if (typeof module !== 'undefined'){
  var fs = require('fs'),
    path = require('path'),
    request = require('request');
}

var helpers = {
  getTimestamp: function(){
    return Math.round((new Date()).getTime() / 1000);
  },
  randomFromArray: function(arr) {
    return arr[Math.floor(Math.random()*arr.length)]; 
  },
  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  getRandomRange: function(min, max, fixed) {
    return (Math.random() * (max - min) + min).toFixed(fixed) * 1;
  },
  getRandomHex: function() {
    return '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
  },
  shadeColor: function(color, percent) {
    // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    var f = parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return `#${(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1)}`;
  },  
  loadImageAssets: function(cb){
    /* Load images from the assets folder */
    console.log('reading assets folder...')
    var that = this;
    fs.readFile('./.glitch-assets', 'utf8', function (err, data) {
      if (err) {
        console.log('error:', err);
        return false;
      }
      data = data.split('\n');
      var data_json = JSON.parse('[' + data.join(',').slice(0, -1) + ']'),
          deleted_images = data_json.reduce(function(filtered, data_img) {
              if (data_img.deleted) {
                 var someNewValue = { name: data_img.name, newProperty: 'Foo' }
                 filtered.push(data_img.uuid);
              }
              return filtered;
            }, []),
          img_urls = [];
      
      for (var i = 0, j = data.length; i < j; i++){
        if (data[i].length){
          var img_data = JSON.parse(data[i]),
              image_url = img_data.url;

          if (image_url && deleted_images.indexOf(img_data.uuid) === -1 && that.extension_check(image_url)){
            var file_name = that.get_filename_from_url(image_url).split('%2F')[1];            
            // console.log(`- ${file_name}`);
            img_urls.push(image_url);
          }
        }
      }
      cb(null, img_urls);
    });      
  },
  extensionCheck: function(url) {
    var file_extension = path.extname(url).toLowerCase(),
        extensions = ['.png', '.jpg', '.jpeg', '.gif'];
    return extensions.indexOf(file_extension) !== -1;
  },
  getFilenameFromUrl: function(url) {
    return url.substring(url.lastIndexOf('/') + 1);
  },
  loadImage: function(url, cb) {
    console.log(`loading remote image: ${url} ...`);
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          var b64content = 'data:' + res.headers['content-type'] + ';base64,';
          console.log('image loaded...');
          cb(null, body.toString('base64'));           
        } else {
          console.log('ERROR:', err);
          cb(err);
        }
    });
  },
  downloadFile: function(uri, filename, cb){
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', cb);
    });
  }
};

if (typeof module !== 'undefined'){
  /* This is to make the file usable both in node and on the front end. */
  module.exports = helpers;
}
