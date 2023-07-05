const httpStatuscode = require("http-status-codes").StatusCodes;
const User = require("../models/users");
const Application = require("../models/application");
const Vacancy = require("../models/vacancy");

const apply = async (req, res) => {
  //apply for a vacancy
  let appCreated = false;

  console.log(req.body);
  const { vacancy, cover_letter } = req.body;

  const appExists = await Application.findOne({
    employee: req.user.id,
    vacancy,
  });

  const user = await User.findOne({ _id: req.user.id });
  const vaca = await Vacancy.findOne({ _id: vacancy });

  if (appExists)
    return res
      .status(httpStatuscode.CONFLICT)
      .json({ error: "Application laready exists" });
  await Vacancy.findOne({ _id: vacancy })
    .then(async (vaca) => {
      if (!vaca) return res.json({ error: "vcancy does not exists" });
      if (new Date(vaca.closingDate) < new Date() || vaca.status === "closed") {
        //vacancy closed
        return res.json({ error: "vacancy has been closed" });
      }

      if (vaca.cover_letter) {
        return await Application.create({
          employee: req.user.id,
          vacancy: vaca._id,
          date: new Date().toDateString(),
          status: "not seen",
          cover_letter,
        }).then(async (app) => {
          await User.findOneAndUpdate(
            { _id: req.user.id },
            { applications: [...user.applications, app._id] }
          ).then(async () => {
            await Vacancy.findOneAndUpdate(
              { _id: vacancy },
              { candidates: [...vaca.candidates, req.user.id] }
            ).then(() => {
              return res.json({ success: "application created" });
            });
          });
        });
      }

      if (!vaca.cover_letter) {
        return await Application.create({
          employee: req.user.id,
          vacancy: vaca._id,
          date: new Date().toDateString(),
          status: "not seen",
        }).then(async (app) => {
          await User.findOneAndUpdate(
            { _id: req.user.id },
            { applications: [...user.applications, app._id] }
          ).then(async () => {
            await Vacancy.findOneAndUpdate(
              { _id: vacancy },
              { candidates: [...vaca.candidates, req.user.id] }
            ).then(() => {
              return res.json({ success: "application created" });
            });
          });
        });
      }
    })
    .catch((err) => {
      return res.status(httpStatuscode.NOT_FOUND).json({ error: err.message });
    });
};

const rejectApp = async (req, res) => {
  const { app } = req.params;
};
const deleteApp = async (req, res) => {
  //delete application from vacancy

  const { application } = req.body;
  await Application.findOneAndDelete({
    _id: application,
    employee: req.user.id,
  })
    .then(async (app) => {
      if (!app)
        return res
          .status(httpStatuscode.NOT_FOUND)
          .json({ error: "application not found" });

      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          application: application.filter((ap) => {
            if (ap !== application) return ap;
          }),
        }
      ).then(async () => {
        Vacancy.findOneAndUpdate(
          { _id: app.job },
          {
            candidates: candidates.filter((ca) => {
              if (ca !== req.user.id) {
                return ca;
              }
            }),
          }
        ).then(() => {
          res
            .status(httpStatuscode.OK)
            .json({ success: "application deleted" });
        });
      });
    })
    .catch((err) => {
      return res.json({ error: err.message });
    });
};

const getApp = async (req, res) => {
  const { id } = req.params;

  console.log(req.params);
  await Application.findOne({ vacancy: id, employee: req.user.id })
    .then((app) => {
      res.status(httpStatuscode.OK).json({ application: app });
    })
    .catch((err) => {
      res.status(httpStatuscode.NOT_FOUND).json({ error: err.message });
    });
};
module.exports = {
  apply,
  deleteApp,
  getApp,
};
