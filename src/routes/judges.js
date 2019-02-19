"use strict";

const express = require("express");
const router = express.Router();

const {
  get,
} = require("../controllers/judges");

router.get("/judges", get);

module.exports = router;
