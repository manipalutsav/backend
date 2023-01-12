import { Schema, model } from "mongoose";

interface Deleted {
  id: string,
  type: string,
  date: Date,
  data: object
}

const schema = new Schema<Deleted>({
  schema: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
}, {
  autoCreate: true,
});

export default model("Deleted", schema);
