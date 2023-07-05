const mongoose = require("mongoose");

const Application = mongoose.Schema({
  employee: {
    type: String,
    required: true,
  },

  vacancy: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  cover_letter: {
    type: String,
  },

  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("applications", Application);
