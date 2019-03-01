"use strict";

const TeamModel = require("../models/Team");
const EventModel = require("../models/Event");

const { addBulkParticipants } = require("./participant");

/**
 * Add new team into the system.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
exports.createTeam = async (req, res) => {
  let {
    event,
    college,
    participants,
  } = req.body;


  // Check if participation limit reached
  let participatedTeams = await TeamModel.find({ college: college });
  let eventInfo = await EventModel.findOne(event);
  if(participatedTeams.length === eventInfo.maxParticpants) {
    return res.status(401).json({
      status: 416,
      message: "Max participation limit reached",
    });
  }

  let members = await addBulkParticipants(participants);

  let team = new TeamModel({
    event,
    college,
    members,
  });

  team.save((err) => {
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
exports.getTeam = async (req, res) => {
  let team = await TeamModel.findById({ id: req.params.id });

  return res.json({
    status: 200,
    message: "Success",
    data: { members : team.members },
  });
};
