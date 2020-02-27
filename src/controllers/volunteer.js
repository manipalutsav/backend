'use strict';

const VolunteerModel = require('../models/Volunteer');

/**
 * Create function which adds a new volunteer detail
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {function} next call the next handler in route
 * @returns {object} the response object
 */
exports.create = async (req, res) => {
    try {

        let volunteer = await VolunteerModel.create({
            name1: req.body.name1,
            regno1: req.body.regno1,
            size1: req.body.size1,
            name2: req.body.name2,
            regno2: req.body.regno2,
            size2: req.body.size2,
            name3: req.body.name3,
            regno3: req.body.regno3,
            size3: req.body.size3,
            name4: req.body.name4,
            regno4: req.body.regno4,
            size4: req.body.size4,
            name5: req.body.name5,
            regno5: req.body.regno5,
            size5: req.body.size5,
        });

        return res.json({
            status: 200,
            message: "Success. New Volunteer created.",
            user_added: volunteer.name_v1,
        });
    } catch (error) {
        console.log("Error while creating volunteer", error);
    }

}

exports.getAll = async (req, res) => {
    try {
        let volunteer = await VolunteerModel.find();
        console.log(volunteer);

        volunteer = volunteer.map(v => ({
            name1: v.name1,
            regno1: v.regno1,
            size1: v.size1,
            name2: v.name2,
            regno2: v.regno2,
            size2: v.size2,
            name3: v.name3,
            regno3: v.regno3,
            size3: v.size3,
            name4: v.name4,
            regno4: v.regno4,
            size4: v.size4,
            name5: v.name5,
            regno5: v.regno5,
            size5: v.size5,
        }));
        return res.json({
            status: 200,
            message: "Success",
            data: volunteer,
        });
    }
    catch (e) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};
