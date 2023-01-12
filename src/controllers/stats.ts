"use strict";

const UserModel = require("../models/User");
const CollegeModel = require("../models/College");
const EventModel = require("../models/Event");
const ParticipantModel = require("../models/Participant");
const TeamModel = require("../models/Team");
const JudgeModel = require("../models/Judge");

import { NextFunction, Request, Response } from "express";
import { College } from "../models/College";
import { Event } from "../models/Event";
import { Judge } from "../models/Judge";
import { Participant } from "../models/Participant";
import { Team } from "../models/Team";


const get = async (req: Request, res: Response) => {
  try {
    let users = await UserModel.find();
    let events = await EventModel.find();
    let colleges = await CollegeModel.find();
    let participants = await ParticipantModel.find();
    let teams = await TeamModel.find();
    let judges = await JudgeModel.find();

    return res.json({
      status: 200,
      message: "Success",
      data: {
        users: {
          total: users.length,
        },
        events: {
          total: events.length,
          staff: events.filter((e: Event) => e.faculty).length,
          venues: [...new Set(events.map((e: Event) => e.venue))].length,
        },
        colleges: {
          total: colleges.length,
          locations: [...new Set(colleges.map((c: College) => c.location))].length,
        },
        participants: {
          total: participants.map((p: Participant) => p.registrationID).length,
          staff: participants.filter((p: Participant) => p.faculty).map((p: Participant) => p.registrationID).length,
        },
        teams: {
          total: teams.filter((t: Team) => t.members.length > 1).length,
        },
        judges: {
          total: judges.map((j: Judge) => j.name).length,
        },
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

export default {
  get,
};
