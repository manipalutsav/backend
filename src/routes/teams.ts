"use strict";

import express from "express";
const router = express.Router();

import Teams from "../controllers/teams";

// Returns the list of all teams
router.get("/", Teams.getAll);

export default router;
