import { Schema, model } from "mongoose";

interface Deleted {
  type: string,
  date: Date,
  data: object
}

const deletedSchema = new Schema<Deleted>({
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

export default model("Deleted", deletedSchema);
