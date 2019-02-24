"use strict";

const CollegeModel = require("../models/College");

const create = (req, res) => {
  let { name, location } = req.body;

  let college = new CollegeModel({
    name,
    location,
  });

  college.save((err) => {
    console.error(err);

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

const get = async (req, res) => {
  let college = await CollegeModel.findById({
    id: req.params.id,
  });

  return res.json({
    status: 200,
    message: "Success",
    data: {
      name: college.name,
      location: college.location,
    },
  });
};

const getAll = async (req, res) => {
  let colleges = await CollegeModel.find();

  colleges = college.map(clg => ({
    name: clg.name,
    location: clg.location,
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: colleges,
  });
};

module.exports = {
  create,
  get,
  getAll,
};
