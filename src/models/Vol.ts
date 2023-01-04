import mongoose from "mongoose";

const schema = {
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
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
};

const options = {
  autoCreate: true,
};
const volSchema = new mongoose.Schema(schema, options);

export default mongoose.model("Vol", volSchema);
