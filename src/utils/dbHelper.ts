import mongoose, { ConnectOptions } from "mongoose";

/**
 * Class for MongoDB connectivity.
 * @class Database
 */
class Database {

  _ip: string
  _port: string
  _host: string
  uri: string
  options: ConnectOptions

  /**
   * @constructor
   */
  constructor() {
    this._ip = process.env.MONGODB_IP || "127.0.0.1";
    this._port = process.env.MONGODB_PORT || "3003";
    this._host = this._ip + ":" + this._port;
    this.uri = "mongodb://" + this._host;
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.MONGODB_DATABASE,
    };

    this._connect();
  }

  /**
   * Connects to MongoDB server
   * @returns {void}
   */
  _connect() {
    mongoose.connect(this.uri, this.options);
    // eslint-disable-next-line no-console
    console.log("Database connection successful");
  }

  /**
   * Closes connection from MongoDB server
   * @returns {Promise} Empty promise
   */
  closeConnection() {
    return new Promise((resolve, reject) => {
      try {
        mongoose.connection.close(() => {
          resolve(0);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default new Database();
