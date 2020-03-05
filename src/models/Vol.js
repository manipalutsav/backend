const mongoose = require("mongoose");

const schema = {
    college: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
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
};

const options = {
    autoCreate: true,
};
const volSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Vol", volSchema);