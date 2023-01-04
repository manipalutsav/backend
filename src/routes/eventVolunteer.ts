"use strict";

import express from "express";
const router = express.Router();

import { addVolunteer, getAll } from "../controllers/eventvolunteer";

// Create a new Volunteer
router.post("/add", addVolunteer);

// get all volunteers
router.get("/", getAll);


export default router;
