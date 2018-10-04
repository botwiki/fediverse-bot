var fs = require('fs'),
    dbFile = './.data/sqlite.db',
    exists = fs.existsSync(dbFile),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database(dbFile),
    POSTS_PER_PAGE = process.env.POSTS_PER_PAGE || 5;

/*

Posts table

id             INT NOT NULL AUTO_INCREMENT
date           DATETIME DEFAULT current_timestamp
type           VARCHAR(255)
content        TEXT
attachment     TEXT [this is a stringified JSON, see https://www.w3.org/TR/activitystreams-vocabulary/#dfn-attachment]

Followers table

url            TEXT PRIMARY KEY
date           DATETIME DEFAULT current_timestamp

*/

module.exports = {  
  init: function(cb){
    db.serialize(function(){
      /*
        TODO: Rewrite this with promises.
      */
      db.run('CREATE TABLE IF NOT EXISTS Posts (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATETIME DEFAULT current_timestamp, type VARCHAR(255), content TEXT, attachment TEXT)', function(err, data){
        if (err){
          console.log(err);
        }
        else{
          db.run('CREATE TABLE IF NOT EXISTS Followers (url TEXT PRIMARY KEY, date DATETIME DEFAULT current_timestamp)', function(err, data){
          // db.run('CREATE TABLE IF NOT EXISTS Followers (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATETIME DEFAULT current_timestamp, url TEXT)', function(err, data){
            if (err){
              console.log(err);
            }
            else{
              console.log('DB ready...');
            }
          });
        }
      });
    });    
  },
  get_posts: function(options, cb){
    var data = [],
        offset = POSTS_PER_PAGE * (options.page - 1);
        
    db.serialize(function(){
/*
      var db_query = `SELECT *, COUNT(*) AS total_count from Posts ORDER BY date DESC LIMIT ${POSTS_PER_PAGE} OFFSET ${offset}`;
      This query doesn't seem to work, two DB calls are necessary to get the total post count.

*/

      db.all('SELECT COUNT(*) AS total_count FROM Posts', function(err, rows) {
        var total_count = rows[0].total_count,
            total_pages= Math.ceil(total_count/POSTS_PER_PAGE);
        
        
        var db_query = `SELECT * from Posts ORDER BY date DESC LIMIT ${POSTS_PER_PAGE} OFFSET ${offset}`;

        db.all(db_query, function(err, rows) {
          if (cb){
            var db_return = {
              post_count: total_count,
              page_count: total_pages,
              posts: rows
            };
            cb(null, db_return);
          }        
        });

      });      
    });
  },
  get_post: function(post_id, cb){
    var data = [];
    db.serialize(function(){
      db.all(`SELECT * from Posts WHERE id=${post_id}`, function(err, rows) {
        if (cb){
          var post_data = (rows ? rows[0] : null);
          cb(null, post_data);
        }        
      });
    });
  },  
  save_post: function(post_data, cb){
    var post_type = post_data.type || 'Note',
        post_content = post_data.content || '',
        post_attachment = post_data.attachment.toString() || '[]';

    db.serialize(function() {
      // db.run(`INSERT INTO Posts (type, content, attachment) VALUES ("${post_type}", "${post_content}", "${post_attachment}")`, function(err, data){
      db.run(`INSERT INTO Posts (type, content, attachment) VALUES ('${post_type}', '${post_content}', '${post_attachment}')`, function(err, data){
        if (err){
          console.log(err);
        }
        if (cb){
          cb(err, this);
        }
      });
    });
  },
  delete_post: function(post_id, cb){
    db.serialize(function() {
      db.run(`DELETE FROM Posts WHERE id="${post_id}"`, function(err, data){
        if (cb){
          cb(err, this);
        }
      });
    });
  },    
  save_follower: function(payload, cb){
    db.serialize(function() {
      db.run(`INSERT INTO Followers (url) VALUES ("${payload.actor}")`, function(err, data){
        if (cb){
          cb(err, this);
        }
      });
    });
  },
  remove_follower: function(payload, cb){
    db.serialize(function() {
      db.run(`DELETE FROM Followers WHERE url="${payload.actor}"`, function(err, data){
        if (cb){
          cb(err, this);
        }
      });
    });
  },  
  get_followers: function(cb){
    var data = [];
    db.serialize(function(){
      
      db.all("SELECT * from Followers ORDER BY date DESC", function(err, rows) {
        if (cb){
          cb(null, rows);
        }        
      });
    });
  },
  drop_table: function(table, cb){
    db.serialize(function(){
      if (table && exists) {
        db.run(`DROP TABLE ${table};`);
        console.log(`dropped table ${table}...`);
        if (cb){
          cb(null);
        }
      }
      else {
        console.log('table not found...');
        if (cb){
          cb(null);
        }
      }
    });
  }  
};
