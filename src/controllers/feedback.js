const Feedback = require("../models/Feedback");

exports.create = async(req, res) => {
    try{
        const {rating, comment, signature, judge, event} = req.body;
        if(!rating || !comment, !signature || !judge || !event){
            return res.status(400).json({
                status: 400,
                message: "Rating, comment, signature, judge id and event id are required ⁉️",
            });
        }
        const feedback = await Feedback({
            rating,
            comment,
            signature,
            judge,
            event
        })
        const result = await feedback.save();
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: result
        });
    }catch(e){
        return res.status(501).json({
            status: 501,
            message: "Internal Server Error ❌",
        });
    }
}

exports.getFeedbackForAnEvent = async(req, res) => {
    try{
        const {event} = req.body;
        if(!event){
            return res.status(400).json({
                status: 400,
                message: "Event id is required ⁉️",
            });
        }
        const feedback = await Feedback.find({ event }).populate("judge", "name");
        if(!feedback){
            return res.status(404).json({
                status: 404,
                message: "No feedback found for the event 🚫",
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: feedback
        });
    }catch(e){
        return res.status(501).json({
            status: 501,
            message: "Internal Server Error ❌",
        });
    }
}
