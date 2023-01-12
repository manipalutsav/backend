"use strict";

const TeamModel = require("../models/Team");
const EventModel = require("../models/Event");

import { NextFunction, Request, Response } from "express";


/**
 * Add new team into the system.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const create = async (req: Request, res: Response) => {
  let {
    event,
    college,
    members,
  } = req.body;


  // Check if participation limit reached
  let participatedTeams = await TeamModel.find({ college: college });
  let eventInfo = await EventModel.findOne(event);
  if (participatedTeams.length === eventInfo.maxParticpants) {
    return res.status(401).json({
      status: 416,
      message: "Max participation limit reached",
    });
  }

  let team = new TeamModel({
    event,
    college,
    members,
  });

  team.save((err: any) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Team created",
      data: team,
    });
  });
};

/**
 * Fetch team details.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const get = async (req: Request, res: Response) => {
  let team = await TeamModel.findById({ id: req.params.id });

  return res.json({
    status: 200,
    message: "Success",
    data: { team },
  });
};

const getAll = async (req: Request, res: Response) => {
  try {
    let teams = await TeamModel.find();

    return res.json({
      status: 200,
      message: "Success",
      data: teams,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

export default {
  create,
  get,
  getAll,
};
