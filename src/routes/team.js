"use strict";

const express = require("express");
const router = express.Router();

const {
  createTeam,
  getTeam,
} = require("../controllers/teams");

router.post("/add", createTeam);
router.get("/get/:id", getTeam);

module.exports = router;
