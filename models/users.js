const mongoose = require("mongoose");

const User = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },
  address: {
    type: String,
  },

  phone: {
    type: String,
  },
  website: {
    type: String,
  },
  posted: Number,
  hired: Number,
  industry: String,
  experience: String,
  profession: String,
  skills: [],
  references: [],
  projects: [],
  vacancies: [],
  applications: [],
});

module.exports = mongoose.model("users", User);
