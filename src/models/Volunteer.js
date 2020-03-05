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
            shirtSize: {
                type: String
            }
        }
    ]
};

const options = {
    autoCreate: true,
};
const volunteerSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Volunteer", volunteerSchema);