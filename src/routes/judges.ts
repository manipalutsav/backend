"use strict";

import express from "express";
const router = express.Router();

import Judges from "../controllers/judges";

// Returns the list of all judges
router.get("/", Judges.get);

// Create a new judge
router.post("/", Judges.create);

export default router;
