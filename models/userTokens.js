const mongoose = require("mongoose");

const userTokens = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },

  refresh: {
    type: String,
    required: true,
  },

  access: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("tokens", userTokens);
