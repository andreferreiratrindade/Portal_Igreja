var MongoClient = require( 'mongodb' ).MongoClient;
var util = require('util');
var config = require('./config');
var _db;
 
// inserir aqui stringConnection
var uri = "conexaoBancoDados";

module.exports = {
  connectToServer: function( callback ) {
    /** Connect to the Mongo database at the URI using the client **/
    MongoClient.connect( uri, { auto_reconnect: true }, function( err, db ) {
      if (err) throw err;
      else if (!db) console.log('Unknown error connecting to database');
      else {
        console.log('Connected to MongoDB database server at:');
        console.log('\n\t%s\n', uri);
        _db = db;
      }
      return callback( err );
    } );
  },
  getDb: function() {
    return _db;
  }
};