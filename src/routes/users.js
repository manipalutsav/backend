"use strict";
const {
  register,
} = require("../controllers/users");

module.exports = app => {
  app.post("/user/register", register);
};
