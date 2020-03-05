"use strict";

const express = require("express");
const router = express.Router();

const {create} = require("../controllers/Vol");

router.post("/add",create);

module.exports = router;