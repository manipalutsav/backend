const mongoose = require("mongoose");

const schema = {
    name1: {
        type: String,
        required: true,
    },
    regno1: {
        type: Number,
        required: true,
    },

    name2: {
        type: String,

    },
    regno2: {
        type: Number,

    },

    name3: {
        type: String,

    },
    regno3: {
        type: Number,

    },

    name4: {
        type: String,

    },
    regno4: {
        type: Number,

    },

    name5: {
        type: String,

    },
    regno5: {
        type: Number,

    },

};

const options = {
    autoCreate: true,
};
const eventVolunteerSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("EventVolunteer", eventVolunteerSchema);