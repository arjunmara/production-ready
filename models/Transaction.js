const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const TransactionSchema = mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "members"
  },
  transactionType: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  materialType: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("transaction", TransactionSchema);
