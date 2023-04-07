"use strict";

const express = require("express");
const router = express.Router();

const Judges = require("../controllers/judges");

// Returns the list of all judges
router.get("/", Judges.getAll);
router.get("/:round", Judges.getForRound);

// Create a new judge
router.post("/", Judges.create);

router.delete("/:judge", Judges.deleteOne);
module.exports = router;
