"use strict";
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const users = require("./routes/users");
const vacancyRoutes = require("./routes/vacancy_routes");
const projectRoutes = require("./routes/project_routes");
const applicationRoutes = require("./routes/application_routes");
const profilePicRoute = require("./routes/profile_upload");
const profilePicdown = require("./routes/profile_download");
const userInforRoutes = require("./routes/user_infor_routes");
const DATABASE = require("./database/connection");
const app = express();

app.use(require("express").static(path.join(__dirname, "static")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  //console.log(req.url, " : ", req.method);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept,Authorization,Origin"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use("/users", users);
app.use("/vaca", vacancyRoutes);
app.use("/proj", projectRoutes);
app.use("/app", applicationRoutes);
app.use("/profile_pic", profilePicRoute);
app.use("/profilepicdl", profilePicdown);
app.use("/infor", userInforRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    console.log(req.url);
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {},
  });
});

app.set("port", process.env.PORT || 3000);

var server = app.listen(app.get("port"), async function () {
  await DATABASE(process.env.DATABASE_URI)
    .then(() => {
      console.log("Express server listening on port " + server.address().port);
    })
    .catch((ex) => {
      console.log("Error : ", ex.message);
      process.exit();
    });
});
