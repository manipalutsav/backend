"use strict";
const {
  register,
  login,
} = require("../controllers/users");

module.exports = app => {
  app.post("/user/register", register);
  app.post("/user/login", login);
};
