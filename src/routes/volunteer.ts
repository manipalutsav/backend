"use strict";

import express from "express";
const router = express.Router();

import { create, getAll, getAllWithCollegeId, getAllFromCollege } from "../controllers/volunteer";

router.post("/addVolunteer", create);

router.get("/", getAll);
router.get("/getAllWithCollegeId", getAllWithCollegeId);
router.get("/getAllFromCollege", getAllFromCollege);


export default router;
