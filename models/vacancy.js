const mongoose = require("mongoose");

const Vacancy = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  industry: {
    type: String,
    required: true,
  },
  duration: String,
  location: String,
  description: {
    type: String,
    required: true,
  },

  //employer name, address(or email), profile-link
  employer: {},

  salary: {
    type: String,
    required: true,
  },
  skills: [],
  positions: Number,
  requirements: [],
  duties_and_responsibilities: [],
  candidates: [],
  short_listed: [],
  rejected: [],
  closingDate: {
    type: Date,
    required: true,
  },
  cover_letter: {
    default: false,
    type: Boolean,
  },
  applied: Number,
  hired: Number,
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("vacancies", Vacancy);
