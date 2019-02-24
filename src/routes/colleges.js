"use strict";

const express = require("express");
const router = express.Router();

// TODO: replace `noop` with actual controllers
const noop = require("../middlewares/noop");
const Colleges = require("../controllers/colleges");

// Returns all colleges
router.get("/", noop);
// Returns the college for the given id
router.get("/:college", Colleges.get);
// Returns the list of participants from the given college
router.get("/:college/participants", noop);
// Returns the list of teams from the given college
router.get("/:college/teams", noop);

// Create a new college
router.post("/", Colleges.create);

module.exports = router;
