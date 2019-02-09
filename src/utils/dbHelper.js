let mongoose = require("mongoose");
const server = "127.0.0.1:27017";
const database = "utsav";


/**
 * Class for mongo connectivity
 *
 */
class Database {
  /**
   * Calls _connect method.
  */
  constructor() {
    this._connect();
  }

  /**
   * connects to mongo server
   */
  _connect() {
    mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true }).then(() => {
      console.log("Database connection successful");
    }).catch(err => {
      console.error("Database connection error: " + err);
    });
  }
}
module.exports = new Database();
