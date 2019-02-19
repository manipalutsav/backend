"use strict";

const TeamsModel = require("../models/Team");
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

  let members = await addBulkParticipants(participants);

  let payload = new TeamsModel({
    event,
    college,
    members,
  });

  payload.save((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 500,
        message: "Bad Request",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Team Created",
    });
  });
};

/**
 * Fetch Teams details.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
exports.getTeam = async (req, res) => {
  let team = await TeamsModel.findById({ id: req.params.id });

  return res.json({
    status: 200,
    message: "Success",
    data: { members : team.members },
  });
};

