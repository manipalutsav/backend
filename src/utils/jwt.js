"use strict";

const jwt = require("jsonwebtoken");

/**
  * PRIVATE_KEY will be kept as an env variable, temporarily holding it here
  * @constant
  * @type {string}
*/
const PRIVATE_KEY = "something" 

/**
  * Default expiry time for jwt token set to 1 hour
  * @constant
  * @type {number}
*/
const EXPIRY_TIME = 60 * 60 

/**
  * Generates a token for a payload with a given expiry time
  * @module generateToken
  * @param {string} payload 
  * @param {number} expiryTime The expiry time for the token
  * @returns {promise<string>} The generated token
*/
const generateToken = (payload, expiryTime = EXPIRY_TIME) => {
  return new Promise(async (resolve, reject) => {
    try {
      let token = jwt.sign(payload, PRIVATE_KEY, { expiresIn: expiryTime });
      resolve(token);
    } catch (err) {
      reject(err);
    }
  });
}

/**
  * Verifies token for validity
  * @module verifyToken
  * @param {string} token The token to be verified 
  * @returns {promise<string>} The decoded token
*/
const verifyToken = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      let decoded = jwt.verify(token, PRIVATE_KEY);
      resolve(decoded);
    } catch (err) {
      reject(err);
    }
  })
}

module.exports = {
  generateToken,
  verifyToken
}