"use strict";

const express = require("express");
const router = express.Router();

const {create, getAll} = require("../controllers/volunteer");

// Create a new Volunteer
router.post("/addVolunteer",create);

//get all users
router.get("/", getAll);

module.exports = router;
