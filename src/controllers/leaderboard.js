"use strict";

const LeaderboardModel = require("../models/Leaderboard");

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

module.exports = {
  get,
};
