import mongoose from "mongoose";

const schema = {
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
};

const options = {
  autoCreate: true,
};

const leaderboardSchema = new mongoose.Schema(schema, options);

export default mongoose.model("Leaderboard", leaderboardSchema);
