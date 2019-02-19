"use strict";

const CollegeModel = require("../models/College");

const createCollege = async (req, res, next) => {
  let { name, location } = req.body;

  let college = new CollegeModel({
    name,
    location,
  });

  college.save((err) => {
    console.error(err);

    if (err) return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });

    return res.status(200).json({
      status: 200,
      message: "Created " + name,
      data: { name, location },
    });
  });
}

const getCollege = async (req, res, next) => {
  let college = await CollegeModel.findById({
    id: req.params.id,
  });

  return res.json({
    status: 200,
    message: "Success",
    data: { college.name, college.location },
  });
}
