import mongoose, { model, Schema } from "mongoose";

export interface User {
  id: string,
  name: string,
  email: string,
  mobile: string,
  type: number,
  password: string,
  college: string
}

const schema = new Schema<User>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  mobile: {
    type: String,
    match: /^(\+\d{1,3}[- ]?)?\d{10}$/,
  },
  type: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
}, {
  autoCreate: true,
});

export default model<User>("User", schema);
