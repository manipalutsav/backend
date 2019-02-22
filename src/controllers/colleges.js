"use strict";

const CollegeModel = require("../models/College");

const createCollege = async (req, res) => {
  let { name, location } = req.body;

  let collegeName = await CollegeModel.findOne({ name: name });

  if(collegeName) {
    return res.json({
      status: 406,
      message: "College already registered",
    });
  }

  let college = new CollegeModel({
    name,
    location,
  });

  college.save((err) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Created " + name,
      data: { name, location },
    });
  });
};

const getCollege = async (req, res) => {
  let college = await CollegeModel.findById({
    _id: req.params.id,
  });

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

const getColleges = async (req, res) => {
  let colleges = await CollegeModel.find();

  if(colleges.length === 0) {
    return res.json({
      status: 404,
      message: "No colleges registered",
    });
  }

  return res.json({
    status: 200,
    message: "Success",
    data: colleges,
  });
};

module.exports = {
  createCollege,
  getCollege,
  getColleges,
};
