const mongoose = require("mongoose");

const Bid = mongoose.Schema({
  employee: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  additional_files: [],
  asking_price: {
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

module.exports = mongoose.model("bids", Bid);
