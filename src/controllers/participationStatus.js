"use strict";

const ParticipationStatus = require("../models/ParticipationStatus");

/**
 * Add new team into the system.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const create = async (req, res) => {

  try {
    let {
      participationStatuses
    } = req.body;

    let exists = await ParticipationStatus.find({ college: participationStatuses[0].college });
    console.log(exists)
    if (exists && exists.length > 0)
      return res.status(400).json({
        status: 400,
        message: "Already Submitted",

      });

    const statues = participationStatuses.map(obj => new ParticipationStatus(obj))

    let response = await ParticipationStatus.insertMany(statues);
    return res.status(200).json({
      status: 200,
      message: "Team created",
      data: statues,
    });
  }
  catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

/**
 * Fetch team details.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const getByCollege = async (req, res) => {
  let statues = await ParticipationStatus.find({ college: req.params.college });

  return res.json({
    status: 200,
    message: "Success",
    data: statues,
  });
};


const getByEvent = async (req, res) => {
  let statues = await ParticipationStatus.find({ event: req.params.event });

  return res.json({
    status: 200,
    message: "Success",
    data: statues,
  });
};

const get = async (req, res) => {
  let statues = await ParticipationStatus.find({});

  return res.json({
    status: 200,
    message: "Success",
    data: statues,
  });
};


module.exports = {
  create,
  getByCollege,
  getByEvent,
  get
};
