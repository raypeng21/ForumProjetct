var MongoClient = require('mongodb').MongoClient

var url = 'mongodb://localhost:27017'
var dbName = 'forum'

// Connecting to the mongodb
function connect(callback) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('connect error', err)
    } else {
      var db = client.db(dbName)
      callback && callback(db)
      client.close()
    }
  })
}

module.exports = {
  connect
}
