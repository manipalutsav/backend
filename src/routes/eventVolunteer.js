"use strict";

const express = require("express");
const router = express.Router();

const {create} = require("../controllers/eventvolunteer");

// Create a new Volunteer
router.post("/addEventVolunteer",create);


module.exports = router;
