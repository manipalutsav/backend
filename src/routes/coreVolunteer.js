"use strict";

const express = require("express");
const router = express.Router();

const { addVolunteer, getAll } = require("../controllers/coreVolunteer");

// Create a new Volunteer
router.post("/add", addVolunteer);

//get all volunteers
router.get("/", getAll);

module.exports = router;
