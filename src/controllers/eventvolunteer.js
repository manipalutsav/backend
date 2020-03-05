"use strict";

const EventVolunteer = require("../models/EventVolunteer");

exports.create = async (req, res) => {
    try {

        let existingVolunteer = await EventVolunteer.findOne({college: req.body.college})
        if (existingVolunteer) {
            return res.status(400).json({
              status: 400,
              message: "Bad request. Volunteer for your college is already added",
            });
          }

        let volunteer = await EventVolunteer.create({
            college: req.body.college,
            name1: req.body.name1,
            regno1: req.body.regno1,

            name2: req.body.name2,
            regno2: req.body.regno2,

            name3: req.body.name3,
            regno3: req.body.regno3,

            name4: req.body.name4,
            regno4: req.body.regno4,

            name5: req.body.name5,
            regno5: req.body.regno5,

            name6: req.body.name6,
            regno6: req.body.regno6,

        });

        return res.json({
            status: 200,
            message: "Success. New Event Volunteer created.",
            user_added: volunteer.name_v1,
        });
    } catch (error) {
        console.log("Error while creating event volunteer", error);
    }
}