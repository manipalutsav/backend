"use strict";

const express = require("express");
const router = express.Router();

const {
  register,
} = require("../controllers/judges");

router.post("/judge/register", register);

module.exports = router;
