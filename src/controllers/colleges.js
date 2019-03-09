"use strict";

const CollegeModel = require("../models/College");
const TeamModel = require("../models/Team");
const ParticipantModel = require("../models/Participant");

/**
 * Create a college object in the DB
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const create = async (req, res) => {
  try {
    if (!req.body.name || !req.body.location) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Invalid request body.",
      });
    }

    let college = await CollegeModel.findOne({ name: req.body.name });

    if (college) {
      return res.status(404).json({
        status: 404,
        message: "Not Found. No college was found for the specified name.",
      });
    }

    college = await CollegeModel.create({
      name: req.body.name,
      location: req.body.location,
    });

    return res.status(200).json({
      status: 200,
      message: "Success. New college created.",
      data: {
        name: college.name,
        location: college.location,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

/**
 * Return college object with request id
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const get = async (req, res) => {

  let college = await CollegeModel.findById(req.params.college);

  if(!college) {
    return res.json({
      status: 404,
      message: "No college registered under this id",
    });
  }

  return res.json({
    status: 200,
    message: "Success",
    data: {
      name: college.name,
      location: college.location,
    },
  });
};

/**
 * Return all colleges
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const getAll = async (req, res) => {
  let colleges = await CollegeModel.find();

  colleges = colleges.map(clg => ({
    id: clg.id,
    name: clg.name,
    location: clg.location,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: colleges,
  });
};

/**
 * Return participants from college
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const getParticipants = async (req, res) => {
  let participants = await ParticipantModel.find({ college: req.params.college });

  participants = participants.map(participant => ({
    registrationID: participant.registrationID,
    name: participant.name,
    email: participant.email,
    mobile: participant.mobile,
    college: participant.college,
    faculty: participant.faculty,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: participants,
  });
};

/**
 * Return teams from college
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const getTeams = async (req, res) => {
  let teams = await TeamModel.find({ college: req.params.college });

  teams = teams.map(team => ({
    event: team.event,
    college: team.college,
    members: team.members,
    disqualified: team.disqualified,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: teams,
  });
};

module.exports = {
  create,
  get,
  getAll,
  getParticipants,
  getTeams,
};
