const mongoose = require("mongoose");

const schema = {
    college: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    list: [
        {
            name: {
                type: String,
                required: true
            },
            regno: {
                type: Number,
                required: true
            },
        }
    ]
};

const options = {
    autoCreate: true,
};
const eventVolunteerSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("EventVolunteer", eventVolunteerSchema);