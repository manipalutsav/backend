"use strict";

const express = require("express");
const router = express.Router();

const Judges = require("../controllers/judges");

// Returns the list of all judges
router.get("/", Judges.get);
router.post("/", Judges.create);

module.exports = router;
