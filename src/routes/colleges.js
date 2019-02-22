"use strict";

const express = require("express");
const router = express.Router();

const { getColleges } = require("../controllers/colleges");

router.get("/",getColleges);

module.exports = router;
