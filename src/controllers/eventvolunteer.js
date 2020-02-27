"use strict";

const EventVolunteer = require("../models/EventVolunteer");

exports.create = async (req, res) => {
    try {

        let volunteer = await EventVolunteer.create({
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