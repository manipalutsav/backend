const mongoose = require("mongoose");

const schema = {
    rating:{
        type: Number,
        required: true
    },
    comment: {
        type: String
    },
    signature: {
        type: String,
        required: true
    },
    judge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Judge",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    }
};

const options = {
    autoCreate: true,
};

const feedbackSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Feedback", feedbackSchema);