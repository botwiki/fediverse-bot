var app = require(__dirname + '/app.js'),
    load_keys = require(__dirname + '/helpers/keys.js'),
    db = require(__dirname + '/helpers/db.js');

db.init();

// db.dropTable('Posts');
// db.dropTable('Followers');
// db.dropTable('Events');

// db.getFollowers(function(err, data){
//   console.log('Followers:', data);
// });

// db.getPosts(function(err, data){
//   console.log('Posts:', data);
// });

// db.getEvents(function(err, data){
//   console.log('Events:', data);
// });

var listener = app.listen(process.env.PORT, function() {
  console.log(`app is running on port ${listener.address().port}...`);
});
