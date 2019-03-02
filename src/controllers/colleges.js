"use strict";

const CollegeModel = require("../models/College");
const TeamModel = require("../models/Team");
const ParticipantModel = require("../models/Participant");

/**
 * create the college
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const create = async (req, res) => {
  let { name, location } = req.body;

  let college = await CollegeModel.findOne({ name: req.body.name });
  if(college) {
    return res.status(400).json({
      status: 400,
      message: "Bad request",
    });
  }

  let collegeDocument = new CollegeModel({
    name,
    location,
  });

  collegeDocument.save((err) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Success",
      data: { name, location },
    });
  });
};

/**
 * return college object with request id
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const get = async (req, res) => {

  let college = await CollegeModel.findById(req.params.college);

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
 * return all colleges
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const getAll = async (req, res) => {
  let colleges = await CollegeModel.find();

  colleges = colleges.map(clg => ({
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
 * return participants from college
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
 * return teams from college
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
