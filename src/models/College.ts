import { Schema, model } from "mongoose";

interface College {
  name: string,
  location: string
}

const collegeSchema = new Schema<College>({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
}, {
  autoCreate: true,
});

export default model<College>("College", collegeSchema);
