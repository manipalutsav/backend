const mongoose = require("mongoose");

/**
 * Class for MongoDB connectivity.
 * @class Database
 */
class Database {
  /**
   * @constructor
   */
  constructor() {
    this._ip = process.env.MONGODB_IP || "127.0.0.1";
    this._port = process.env.MONGODB_PORT;
    this._host = this._ip + ":" + this._port;
    this.uri = "mongodb://" + this._host;
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.MONGODB_DATABASE,
    };
  }

  /**
   * Connects to MongoDB server
   * @returns {void}
   */
  connect() {
    return mongoose.connect(this.uri, this.options).then(() => {
      // eslint-disable-next-line no-console
      console.tick("Database connection successful", this.uri);
    });
  }

  /**
   * Closes connection from MongoDB server
   * @returns {Promise} Empty promise
   */
  closeConnection() {
    return new Promise((resolve, reject) => {
      try {
        mongoose.connection.close(() => {
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = new Database();
