const app = require(__dirname + "/app.js"),
  db = require(__dirname + "/helpers/db.js"),
  bot = require(__dirname + "/bot/bot.js"),
  CronJob = require("cron").CronJob,
  cronSchedules = require(__dirname + "/helpers/cron-schedules.js");

db.init();

/*********************************************/
/* FOR DEBUGGING */

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

// bot.script();

/* DEBUGGING END */
/*********************************************/

/* Schedule your bot. See helpers/cron-schedules.js for common schedules, or the cron package documentation at https://www.npmjs.com/package/cron to create your own.*/

// ( new CronJob( cronSchedules.EVERY_SIX_HOURS, function() { bot.script() } ) ).start();
// ( new CronJob( cronSchedules.EVERY_THIRTY_SECONDS, function() { bot.script() } ) ).start();

const listener = app.listen(process.env.PORT, function() {
  console.log(`app is running on port ${listener.address().port}...`);
});
