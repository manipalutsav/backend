import { Schema, model } from "mongoose";

export interface College {
  id: string,
  _id: string,
  name: string,
  location: string
}

const schema = new Schema<College>({
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

export default model<College>("College", schema);
