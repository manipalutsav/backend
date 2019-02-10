let mongoose = require("mongoose");

/**
 * Class for mongo connectivity
 *
 */
class Database {
  /**
   * Calls _connect method.
  */
  constructor() {
    this._ip = process.env.MONGODB_IP || "127.0.0.1";
    this._port = process.env.MONGODB_PORT;
    this._host = this._ip + ":" + this._port;
    this._database = process.env.MONGODB_DATABASE;
    this.uri = "mongodb://" + this._host + "/" + this._database;

    this._connect();
  }

  /**
   * connects to mongo server
   */
  _connect() {
    mongoose.connect(this.uri, { useNewUrlParser: true }).then(() => {
      console.log("Database connection successful");
    }).catch(err => {
      console.error("Database connection error: " + err);
    });
  }
}

module.exports = new Database();
