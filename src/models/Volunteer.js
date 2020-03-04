const mongoose = require("mongoose");

const schema = {
    college: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    name1: {
        type: String,
        required: true,
    },
    regno1: {
        type: Number,
        required: true,
    },
    size1: {
        type: String,
        required: true,
    },
    name2: {
        type: String,
        
    },
    regno2: {
        type: Number,
        
    },
    size2: {
        type: String,
        
    },
    name3: {
        type: String,
        
    },
    regno3: {
        type: Number,
        
    },
    size3 : {
        type: String,
        
    },
    name4: {
        type: String,
        
    },
    regno4: {
        type: Number,
        
    },
    size4: {
        type: String,
        
    },
    name5: {
        type: String,
        
    },
    regno5: {
        type: Number,
        
    },
    size5: {
        type: String,
        
    },
    name6: {
        type: String,
        
    },
    regno6: {
        type: Number,
        
    },
    size6: {
        type: String,
        
    },
};

const options = {
    autoCreate: true,
};
const volunteerSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Volunteer", volunteerSchema);