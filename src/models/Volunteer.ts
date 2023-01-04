import mongoose from "mongoose";

const schema = {
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  list: [
    {
      name: {
        type: String,
        required: true,
      },
      regno: {
        type: Number,
        required: true,
      },
      shirtSize: {
        type: String,
      },
    },
  ],
};

const options = {
  autoCreate: true,
};
const volunteerSchema = new mongoose.Schema(schema, options);

export default mongoose.model("Volunteer", volunteerSchema);
