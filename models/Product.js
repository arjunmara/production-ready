const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: "members"
  },
  productName: {
    type: String,
    required: true,
    unique: true
  },
  productDesc: {
    type: String
  },
  productImg: {
    type: String
  },
  productPrice: {
    type: Number,
    required: true
  },
  productQuantity: {
    type: Number,
    required: true
  },
  productOriginalCost: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

module.exports = Product = mongoose.model("product", ProductSchema);
