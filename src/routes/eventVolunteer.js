"use strict";

const express = require("express");
const router = express.Router();

const { addVolunteer } = require("../controllers/eventvolunteer");

// Create a new Volunteer
router.post("/add", addVolunteer);


module.exports = router;
