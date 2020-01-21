const fs = require( 'fs' ),
      dbFile = './.data/sqlite.db',
      exists = fs.existsSync( dbFile ),
      sqlite3 = require( 'sqlite3' ).verbose(),
      sqlDb = new sqlite3.Database( dbFile ),
      POSTS_PER_PAGE = process.env.POSTS_PER_PAGE || 5;

/*

Posts table

id             INT NOT NULL AUTO_INCREMENT
date           DATETIME DEFAULT current_timestamp
type           VARCHAR( 255 )
in_reply_to    TEXT
content        TEXT
attachment     TEXT [this is a stringified JSON, see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-attachment]

Followers table

url            TEXT PRIMARY KEY
date           DATETIME DEFAULT current_timestamp

Events table

id             TEXT PRIMARY
date           DATETIME DEFAULT current_timestamp


*/

module.exports = {  
  init: function( cb ){
    sqlDb.serialize( function(){
      /*
        TODO: Rewrite this with promises and callback support.
      */

      sqlDb.run( 'CREATE TABLE IF NOT EXISTS Posts ( id INTEGER PRIMARY KEY AUTOINCREMENT, date DATETIME DEFAULT current_timestamp, type VARCHAR( 255 ), in_reply_to TEXT, content TEXT, attachment TEXT )', function( err, data ){
        if ( err ){
          console.log( err );
        }
      } );

      sqlDb.run( 'CREATE TABLE IF NOT EXISTS Followers ( url TEXT PRIMARY KEY, date DATETIME DEFAULT current_timestamp )', function( err, data ){
        if ( err ){
          console.log( err );
        }
      } );

      sqlDb.run( 'CREATE TABLE IF NOT EXISTS Events ( id TEXT PRIMARY KEY, date DATETIME DEFAULT current_timestamp )', function( err, data ){
        if ( err ){
          console.log( err );
        }
      } );

    } );    
  },
  getPosts: function( options, cb ){
    let data = [],
        page = ( options && options.page ? options.page : 1 ),
        queryLimit = POSTS_PER_PAGE,
        offset = POSTS_PER_PAGE * ( page - 1 );
    
    if (options && typeof options.limit !== 'undefined') {
      queryLimit = parseInt( options.limit );
    }
    
    sqlDb.serialize( function(){
/*
      let dbQuery = `SELECT *, COUNT( * ) AS total_count from Posts ORDER BY date DESC LIMIT ${POSTS_PER_PAGE} OFFSET ${offset}`;
      This query doesn't seem to work, two DB calls are necessary to get the total post count.

*/

      sqlDb.all( 'SELECT COUNT( * ) AS total_count FROM Posts', function( err, rows ) {
        let totalCount = 0;
                
        if ( rows ){
          totalCount = rows[0].total_count;
        }
        
        let totalPages = Math.ceil( totalCount/POSTS_PER_PAGE );
        let dbQuery = `SELECT * from Posts ORDER BY date DESC${ queryLimit > 0 ? ` LIMIT ${queryLimit} OFFSET ${offset} ` : ''  }`;
        
        sqlDb.all( dbQuery, function( err, rows ) {
          if ( cb ){
            let db_return = {
              post_count: totalCount,
              page_count: totalPages,
              posts: rows
            };
            cb( err, db_return );
          }        
        } );

      } );      
    } );
  },
  getPost: function( post_id, cb ){
    let data = [];
    sqlDb.serialize( function(){
      sqlDb.all( `SELECT * from Posts WHERE id=${post_id}`, function( err, rows ) {
        if ( cb ){
          let post_data = ( rows ? rows[0] : null );
          cb( err, post_data );
        }        
      } );
    } );
  },  
  savePost: function( post_data, cb ){
    let post_type = post_data.type || 'Note',
        post_content = post_data.content || '',
        in_reply_to = post_data.in_reply_to || '',
        post_attachment = post_data.attachment.toString() || '[]';

    sqlDb.serialize( function() {
      // sqlDb.run( `INSERT INTO Posts ( type, content, attachment ) VALUES ( "${post_type}", "${post_content}", "${post_attachment}" )`, function( err, data ){
      sqlDb.run( `INSERT INTO Posts ( type, content, in_reply_to, attachment ) VALUES ( '${post_type}', '${post_content}', '${in_reply_to}', '${post_attachment}' )`, function( err, data ){
        if ( err ){
          console.log( err );
        }
        if ( cb ){
          cb( err, this );
        }
      } );
    } );
  },
  deletePost: function( post_id, bot, cb ){
    const dbHelper = this;
    
    sqlDb.serialize( function() {
      sqlDb.run( `DELETE FROM Posts WHERE id="${post_id}"`, function( err, data ){
          dbHelper.getFollowers( function( err, followers ){
            console.log( 'followers:', followers );
            followers.forEach( function( follower ){
              if ( follower.url ){
                bot.deletePost( post_id, follower.url, function( err, data ){
                  if ( cb ){
                    cb( err, this );
                  }
                } );
              }
            } );
          } );        
      } );
    } );
  },    
  saveFollower: function( payload, cb ){
    sqlDb.serialize( function() {
      sqlDb.run( `INSERT INTO Followers ( url ) VALUES ( "${payload.actor}" )`, function( err, data ){
        if ( cb ){
          cb( err, this );
        }
      } );
    } );
  },
  removeFollower: function( payload, cb ){
    sqlDb.serialize( function() {
      sqlDb.run( `DELETE FROM Followers WHERE url="${payload.actor}"`, function( err, data ){
        if ( cb ){
          cb( err, this );
        }
      } );
    } );
  },  
  getFollowers: function( cb ){
    let data = [];
    sqlDb.serialize( function(){
      
      sqlDb.all( "SELECT * from Followers ORDER BY date DESC", function( err, rows ) {
        if ( cb ){
          cb( err, rows );
        }        
      } );
    } );
  },
  saveEvent: function( event_id, cb ){
    sqlDb.serialize( function() {
      sqlDb.run( `INSERT INTO Events ( id ) VALUES ( '${event_id}' )`, function( err, data ){
        if ( err ){
          console.log( err );
        }
        if ( cb ){
          cb( err, this );
        }
      } );
    } );
  },  
  getEvent: function( event_id, cb ){
    let data = [];
    sqlDb.serialize( function(){
      sqlDb.all( `SELECT * from Events WHERE id='${event_id}'`, function( err, rows ) {
        if ( cb ){
          let data = ( rows ? rows[0] : null );
          cb( err, data );
        }        
      } );
    } );
  },
  getEvents: function( cb ){
    sqlDb.serialize( function(){
      sqlDb.all( 'SELECT * FROM Events', function( err, rows ) {
        if ( cb ){
          cb( err, rows );
        }        
      } );      
    } );
  },  
  getReplies: function( in_reply_to, cb ){
    let data = [];
    sqlDb.serialize( function(){
      sqlDb.all( `SELECT * from Posts WHERE in_reply_to='${in_reply_to}'`, function( err, rows ) {
        if ( cb ){
          let post_data = ( rows ? rows[0] : null );
          cb( err, post_data );
        }        
      } );
    } );
  },  
  dropTable: function( table, cb ){
    sqlDb.serialize( function(){
      if ( table && exists ) {
        sqlDb.run( `DROP TABLE ${table};` );
        console.log( `dropped table ${table}...` );
        if ( cb ){
          cb( null );
        }
      }
      else {
        console.log( 'table not found...' );
        if ( cb ){
          cb( null );
        }
      }
    } );
  }  
};

