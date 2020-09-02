const app = require( __dirname + '/app.js' ),
      load_keys = require( __dirname + '/helpers/keys.js' ),
      db = require( __dirname + '/helpers/db.js' ),
      bot = require(__dirname + '/bot/bot.js'),
      CronJob = require( 'cron' ).CronJob,
      cronSchedules = require( __dirname + '/helpers/cron-schedules.js' );

db.init();

// db.dropTable( 'Posts' );
// db.dropTable( 'Followers' );
// db.dropTable( 'Events' );

// db.getFollowers( function( err, data ){
//   console.log( 'Followers:', data );
// } );

// db.getPosts( function( err, data ){
//   console.log( 'Posts:', data );
// } );

// db.getEvents( function( err, data ){
//   console.log( 'Events:', data );
// } );

// const job = new CronJob( cronSchedules.EVERY_SIX_HOURS, function() { bot.script() } );
const job = new CronJob( cronSchedules.EVERY_FIVE_SECONDS, function() { bot.script() } );

// job.start();

bot.script();



const listener = app.listen(process.env.PORT, function(){
  console.log( `app is running on port ${listener.address().port}...` );
});
