import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    surename: {
      type: String,
      required: true
    },
    patronymic: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    },
    avatarUrl: String,
  },
  {
    timeseries: true
  }
)

export default mongoose.model('User', UserSchema)