"use strict";

const jwt = require("../utils/jwt");

exports.authenticate = async (req, res, next) => {
  let response = {
    success: false,
    message: "Unauthorized. ",
  };

  const token = req.cookies.token;

  if (!token) {
    response.message += "Someone ate my cookie!";

    return res.status(401).json(response);
  }

  try {
    await jwt.verifyToken(token);

    next();
  } catch (e) {
    response.message += e.toString();

    res.status(401).json(response);
  }
};
