"use strict";

const express = require("express");
const router = express.Router();

const {create, getAll, get, getCollegeVolunteer} = require("../controllers/volunteer");

// Create a new Volunteer
router.post("/addVolunteer",create);
//allowing to create multiple
router.get("/",getAll);//This is there right
router.get("/get/:collegeId",get);
router.get("/getCollegeVolunteer", getCollegeVolunteer)

module.exports = router;
