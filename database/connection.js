const mongoose = require("mongoose");

const Database = (URL) => {
  return mongoose
    .connect(URL)
    .then(() => {
      console.log("DATABASE CONNECTED");
    })

    .catch((err) => {
      console.log(err);
    });
};

module.exports = Database;
