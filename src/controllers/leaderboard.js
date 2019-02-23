"use strict";

const LeaderboardModel = require("../models/Leaderboard");
const CollegeModel = require("../models/College");

/**
 * Returns the leaderboard
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const get = async (req, res) => {
  let leaderboard = await LeaderboardModel.find();
  leaderboard = leaderboard.map(lb => ({ college, points }));

  return res.json({
    status: 200,
    message: "Success",
    data: leaderboard,
  });
};

/**
 * Create the leaderboard with initial scores
 * @param {object} req the request object
 * @param {object} res the response object
 * @returns {object} the response object
 */
const init = async (req, res) => {
  let colleges = await CollegeModel.find();
  colleges = colleges.map(clg => clg.id);

  let leaderboard = colleges.map(clg => ({
    college: clg,
    points: 0,
  }));

  await LeaderboardModel.create(leaderboard);

  return res.json({
    status: 200,
    message: "Success",
    data: leaderboard,
  });
};

module.exports = {
  get,
  init,
};
