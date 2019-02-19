"use strict";

const ParticipantModal = require("../models/Participant");

/**
 * Add new Participant into the system.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */

exports.addParticipant = (req, res) => {
  let {
    registrationID,
    name,
    email,
    mobile,
    college,
    faculty,
  } = req.body;

  let payload = new ParticipantModal({
    registrationID,
    name,
    email,
    mobile,
    college,
    faculty,
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
      message: "Participant Added",
    });
  });
};

/**
 * Insert Participents in bulk.
 * @param {object} data The request object
 * @returns {Array}
 */
exports.addBulkParticipants = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let members = [];
      await data.map(each => {
        let participant = new ParticipantModal({
          registrationID: each.registrationID,
          name: each.name,
          email: each.email,
          mobile: each.mobile,
          faculty: each.faculty,
        });
        members.push(participant._id);
        participant.save(err => {
          if(err) {
            throw err;
          }
        });
      });
      resolve(members);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Fetch Participnat details.
 * @param {object} req The request object
 * @param {object} res The response object
 * @returns {void}
 */
exports.getParticipant = async (req, res) => {
  let participant = await ParticipantModal.findById({ id: req.params.id });

  return res.json({
    status: 200,
    message: "Success",
    data: {
      name: participant.name,
      email: participant.email,
      mobile: participant.mobile,
      college: participant.college,
      faculty: participant.faculty,
    },
  });
};

