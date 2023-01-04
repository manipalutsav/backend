"use strict";

import express from "express";
const router = express.Router();

import Participants from "../controllers/participants";

// Returns the list of all participants
router.get("/", Participants.getAll);
// Returns the specified participant
router.get("/:participant", Participants.get);

// Updates the details of the specified participant
router.patch("/:participant", Participants.update);

export default router;
