import mongoose from "mongoose";

const schema = {
  number: {
    type: Number,
    required: true,
  },
  round: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};

const options = {
  autoCreate: true,
};

const slotSchema = new mongoose.Schema(schema, options);

export default mongoose.model("Slot", slotSchema);
