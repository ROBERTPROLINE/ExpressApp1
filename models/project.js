const mongoose = require("mongoose");

const Project = mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  additional_files: [],
  requirements: [],
  bids: [],
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("projects", Project);
