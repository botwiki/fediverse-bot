var app = require(__dirname + '/app.js'),
    load_keys = require(__dirname + '/helpers/keys.js'),
    db = require(__dirname + '/helpers/db.js');

db.init();

// db.drop_table('Posts');
// db.drop_table('Followers');
// db.drop_table('Events');

// db.get_followers(function(err, data){
//   console.log('Followers:', data);
// });

// db.get_posts(function(err, data){
//   console.log('Posts:', data);
// });

// db.get_events(function(err, data){
//   console.log('Events:', data);
// });

var listener = app.listen(process.env.PORT, function() {
  console.log(`app is running on port ${listener.address().port}...`);
});
