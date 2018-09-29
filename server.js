var app = require(__dirname + '/app.js'),
    load_keys = require(__dirname + '/helpers/keys.js'),
    db = require(__dirname + '/helpers/db.js');

// db.drop_table('Posts');
// db.drop_table('Followers');

db.init();

var listener = app.listen(process.env.PORT, function() {
  console.log(`app is running on port ${listener.address().port}...`);
});

db.get_followers(function(err, data){
  console.log(data);
});

