"use strict";

const TeamModel = require("../models/Team");
const EventModel = require("../models/Event");
const ParticipantModel = require("../models/Participant");
const path = require("path");
const fs = require("fs");
const WinnerSubmission = require("../models/Winners");

/**
 * Add new team into the system.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
const create = async (req, res) => {
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
const get = async (req, res) => {
  let team = await TeamModel.findById({ id: req.params.id });

  return res.json({
    status: 200,
    message: "Success",
    data: { team },
  });
};

const getAll = async (req, res) => {
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

const deleteOne = async (req, res) => {
  try {
    let participant = await ParticipantModel.findById(req.params.participant);
    let team = await TeamModel.findById(req.params.team).populate('event');

    if (!participant) {
      return res.status(404).json({
        status: 404,
        message: "Not Found. No participant was found for the given ID.",
      });
    }

    if(!team){
      return res.status(404).json({
        status: 404,
        message: "Not Found. No team was found for the given ID.",
      });
    }

    if(team.members.length <= team.event.minMembersPerTeam){
      return res.status(403).json({
        status: 403,
        message: "Min. members should be there!",
      });
    }
    
    // Removing member id from team
    team.members = await team.members.filter((m) => !m.equals(participant._id));
    await team.save();

    await ParticipantModel.findByIdAndDelete(participant._id);

    return res.status(200).json({
      status: 200,
      message: "Deleted successfully!",
    });

  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};


const getTeamByCollegeIdAndEventId = async (req, res) => {
  try {
    const { collegeId, eventId } = req.params;
    if(!collegeId || !eventId){
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
      });
    }
    let team = await TeamModel.findOne({ event: eventId, college: collegeId });

    return res.status(200).json({
      status: 200,
      message: "Success",
      data: team,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};




const VALID_PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;

exports.submitWinners = async (req, res) => {
  try {
    const { collegeId, eventId, participants } = req.body;

    if (!collegeId || !eventId || !participants || !Array.isArray(participants)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const parsedParticipants = [];

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];

      // Validate PAN number
      if (!VALID_PAN_REGEX.test(p.pan)) {
        return res.status(400).json({ message: `Invalid PAN number for participant ${i + 1}` });
      }

      // Validate uploaded files exist
      const panFile = req.files[`panPhoto-${i}`]?.[0];
      const chequeFile = req.files[`chequePhoto-${i}`]?.[0];

      if (!panFile || !chequeFile) {
        return res.status(400).json({ message: `Missing files for participant ${i + 1}` });
      }

      // File validation (size and type already handled in middleware)
      parsedParticipants.push({
        name: p.name,
        regNo: p.regNo,
        pan: p.pan,
        panPhotoPath: panFile.path,
        accountNumber: p.accountNumber,
        bankName: p.bankName,
        branch: p.branch,
        ifsc: p.ifsc,
        phone: p.phone,
        chequePhotoPath: chequeFile.path
      });
    }

    // Save to DB
    const newSubmission = new WinnerSubmission({
      collegeId,
      eventId,
      participants: parsedParticipants
    });

    await newSubmission.save();

    res.status(200).json({ message: "Submission successful", submissionId: newSubmission._id });
  } catch (error) {
    console.error("Winner submission error:", error);
    res.status(500).json({ message: e.message });
  }
};


module.exports = {
  create,
  get,
  getAll,
  deleteOne,
  getTeamByCollegeIdAndEventId
};
