import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      index: true
    },
    image: String ,
    patronymic: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timeseries: true,
    // autoCreate: true,
    // autoIndex: true,
  }
)

export default mongoose.model('Product', ProductSchema)