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
        
        
        let existingVolunteer = await VolunteerModel.findOne({college: req.body.college})
        if (existingVolunteer) {
            return res.status(400).json({
              status: 400,
              message: "Bad request. An account with that email already exist.",
            });
          }
        
        let volunteer = await VolunteerModel.create({
            college: req.body.college,
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
            name6: req.body.name6,
            regno6: req.body.regno6,
            size6: req.body.size6,
        });

        return res.json({
            status: 200,
            message: "Success. New Volunteer created.",
            user_added: volunteer.name1,
        });
    } catch (error) {
        console.log("Error while creating volunteer", error);
    }

}


exports.getAll = async (req, res) => {

    try {
        let volunteers = await VolunteerModel.find().populate({
            path: "college",
            model: "College",
        });
        volunteers = volunteers.map(v => ({
            college: v.college,
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
            name4: v.name4,
            regno4: v.regno4,
            size4: v.size4,
        }));

        return res.json({
            status: 200,
            message: "Success",
            data: volunteers,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
}

exports.get = async (req, res) => {
    console.log(req.params.collegeId);
    
    let volunteer = await VolunteerModel.find({college:req.params.collegeId});
    return res.json({
        status: 200,
        message: "Success",
        data: { volunteer },
    });

}

exports.getCollegeVolunteer = async (req, res) => {
    try {
        let volunteer = await VolunteerModel.findById({ _id: req.params.id });
        return res.json({
            status: 200,
            message: "Success",
            data: { volunteer },
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
}


