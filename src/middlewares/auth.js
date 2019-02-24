"use strict";

const jwt = require("../utils/jwt");
const UserModel = require("../models/User");

module.exports = async (req, res, next) => {
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
    let payload = await jwt.verifyToken(token);

    let user = await UserModel.findById(payload.id);

    if (!user) res.status(401).json(response);

    if (user.id !== payload.id
      || user.email !== payload.email
      || user.password !== payload.password
      || user.type !== payload.type) res.status(401).json(response);

    req.user = payload;

    next();
  } catch (e) {
    response.message += e.toString();

    res.status(401).json(response);
  }
};
