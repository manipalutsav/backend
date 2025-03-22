"use strict";
const ObjectId = require("mongodb").ObjectId;
const JudgeModel = require("../models/Judge");
const JudgeScoreModel = require("../models/JudgeScore");
const FeedbackModel = require("../models/Feedback");
const getAll = async (req, res) => {
  try {
    let judges = await JudgeModel.find();

    judges = judges.map(judge => ({
      id: judge.id,
      name: judge.name,
      rounds: judge.rounds,
    }));

    return res.json({
      status: 200,
      message: "Success",
      data: judges,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const getForRound = async (req, res) => {
  try {
    let judges = await JudgeModel.find({ rounds: req.params.round });

    judges = judges.map(judge => ({
      id: judge.id,
      name: judge.name,
      rounds: judge.rounds,
    }));

    return res.json({
      status: 200,
      message: "Success",
      data: judges,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const create = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
      });
    }

    let judge = await JudgeModel.findOne({ name: req.body.name });

    if (judge) {
      if (req.body.round) {
        judge.rounds.push(req.body.round);
        await judge.save();
      }
    } else {
      judge = await JudgeModel.create({
        name: req.body.name,
        rounds: req.body.round ? [req.body.round] : [],
      });
    }

    return res.json({
      status: 200,
      message: "Success",
      data: {
        id: judge.id,
        name: judge.name,
        rounds: judge.rounds,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
/**
 * Deletes a judge by ID and removes all associated judge score records and feedback.
 * 
 * This function:
 * 1. Extracts the judge ID from the request parameters.
 * 2. Checks if the judge exists in the database.
 * 3. If the judge does not exist, returns a 404 error response.
 * 4. Deletes all `JudgeScore` records linked to the specified judge.
 * 5. Deletes all `Feedback` records linked to the specified judge.
 * 6. Deletes the judge record from the database.
 * 7. Returns a success response if the operation is completed successfully.
 * 8. Handles any errors by returning a 500 Internal Server Error response.
 * 
 * @param {Object} req - Express request object containing the judge ID in `req.params.id`.
 * @param {Object} res - Express response object for sending JSON responses.
 * @returns {Object} JSON response indicating success or failure of the deletion operation.
 */
const deleteJudgeById = async (req, res) => {
  try {
    const judge_id = req.params.id;

    // Check if the judge exists
    const judge = await JudgeModel.findById(judge_id);
    if (!judge) {
      return res.status(404).json({
        status: 404,
        message: "Judge not found",
      });
    }

    // Delete related JudgeScore entries
    await JudgeScoreModel.deleteMany({ judge: judge_id });

    // Delete the judge
    await JudgeModel.findByIdAndDelete(judge_id);
    await FeedbackModel.deleteOne({judge: ObjectId((judge_id))});

    return res.json({
      status: 200,
      message: "Judge deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};


module.exports = {
  getAll,
  getForRound,
  create,
  deleteJudgeById
};
