"use strict";

const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/users");

router.post("/user/register", register);
router.post("/login", login);

module.exports = router;
