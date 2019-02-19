"use strict";

const express = require("express");
const router = express.Router();

const {
  register,
} = require("../controllers/judges");

router.post("/register", register);

module.exports = router;
