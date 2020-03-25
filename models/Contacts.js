const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const ContactSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("The email is not valid");
      }
    }
  },
  phone: {
    type: String
  },
  type: {
    type: String,
    default: "Personal"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("contact", ContactSchema);
