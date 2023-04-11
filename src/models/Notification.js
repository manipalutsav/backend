const mongoose = require("mongoose");

const schema = {
  message: {
    type: String,
    required: true,
  },
  email: {
    type: Boolean,
    required: true,
  },
  whatsapp: {
    type: Boolean,
    required: true,
  },
  sms: {
    type: Boolean,
    required: true,
  },
  push: {
    type: Boolean,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  whatsappCount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true
  }
};

const options = {
  autoCreate: true,
};

const notificationSchema = new mongoose.Schema(schema, options);

module.exports = mongoose.model("Notification", notificationSchema);
