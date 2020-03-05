"use strict";

const express = require("express");
const router = express.Router();


const {create, getAll, getAllWithCollegeId, getAllFromCollege} = require("../controllers/eventvolunteer");


// Create a new Volunteer
router.post("/addVolunteer",create);
//allowing to create multiple
router.get("/",getAll);//This is there right
router.get("/getAllWithCollegeId",getAllWithCollegeId);
router.get("/getAllFromCollege",getAllFromCollege);

module.exports = router;