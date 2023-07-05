const mongoose = require("mongoose");

const Organization = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  logo: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  employees: [],
  vacancies: [],
});

module.exports = mongoose.model("organizations", Organization);
