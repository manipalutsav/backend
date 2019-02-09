"use strict";

const jwt = require("../utils/jwt");


/**
  * Checks if user is authenticated (requires permission integration)
  * @module isAuthenticated
*/
const isAuthenticated = async (req, res, next) => {
  let response = {
    success: false,
    message: undefined
  }

  const token = req.cookies.token;

  if(token) {
    try {
      let data = await jwt.verifyToken(token);
      next();
    } catch (err) {
      response = {
        ...response,
        message: error
      }

      res.status(200).json(response);
    }

  } else {
    response = {
      ...response,
      message : 'Cookie undefined.'
    }

    res.status(401).json(response);
  }
}