const mongoose = require("mongoose");

const Help = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("help", Help);
