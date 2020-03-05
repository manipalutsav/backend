"use strict";

const VolunteerModel = require("../models/Vol");

/**
 * Create function which adds a new volunteer detail
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {function} next call the next handler in route
 * @returns {object} the response object
 */
exports.create = async (req, res) => {
  try {
    let volunteer = await VolunteerModel.create(req.body);

    return res.json({
      status: 200,
      message: "Success. New Volunteer created.",
      data: volunteer,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};
