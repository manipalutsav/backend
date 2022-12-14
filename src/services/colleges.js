"use strict";

const CollegeModel = require("../models/College");

const create = async ({ name, location }) => {
  try {
    if (!name || !location) {
      throw "Bad request. Invalid request body.";
    }

    let college = await CollegeModel.findOne({ name, location });

    if (college) {
      return college;
    }

    college = await CollegeModel.create({
      name,
      location,
    });

    return {
      id: college.id,
      name: college.name,
      location: college.location,
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  create
};
