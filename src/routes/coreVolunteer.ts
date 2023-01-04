import express from "express";
import { addVolunteer, getAll } from "../controllers/coreVolunteer";

const router = express.Router();

// Create a new Volunteer
router.post("/add", addVolunteer);

// get all volunteers
router.get("/", getAll);

export default router;
