"use strict";

const express = require("express");
const router = express.Router();

const {create, getAll, get} = require("../controllers/volunteer");

// Create a new Volunteer
router.post("/addVolunteer",create);
router.get("/",getAll);
router.get("/get",get)

module.exports = router;
