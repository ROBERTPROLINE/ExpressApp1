const httpStatuscode = require("http-status-codes").StatusCodes;
const User = require("../models/users");
const Application = require("../models/application");
const Vacancy = require("../models/vacancy");

const apply = async (req, res) => {
  //apply for a vacancy
  let appCreated = false;

  //console.log(req.body);
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
  const { id } = req.params;

  const appExists = await Application.findOne({ _id: id });
  const vacancy = await Vacancy.findOne({ _id: appExists.vacancy });

  if (!appExists)
    return res
      .status(httpStatuscode.NOT_FOUND)
      .json({ error: "application does not exists" });

  if (vacancy.employer.id !== req.user.id)
    return res.status(httpStatuscode.FORBIDDEN).json({
      error:
        "You cannot reject an applicaton that does not belong to your vacancy",
    });

  await Application.findOneAndUpdate({ _id: id }, { status: "rejected" })
    .then(() => {
      res.status(httpStatuscode.OK).json({ success: "application rejected" });
    })
    .catch((err) => {
      res.status(httpStatuscode.NO_CONTENT).json({ Error: err.message });
    });
};
const deleteApp = async (req, res) => {
  //delete application from vacancy

  const { id } = req.params;
  const application = await Application.findOne({ _id: id });
  await Application.findOneAndDelete({
    _id: id,
    employee: req.user.id,
  })
    .then(async (app) => {
      if (!app)
        return res
          .status(httpStatuscode.NOT_FOUND)
          .json({ error: "application not found" });

      const userApplications = await User.findOne({ _id: req.user.id });
      const vacaCandidates = await Vacancy.findOne({ _id: app.vacancy });

      //remove user for candidates of the current vacancy

      await Vacancy.findOneAndUpdate(
        { _id: app.vacancy },
        {
          candidates: vacaCandidates.candidates.filter((cand) => {
            if (cand !== req.user.id) return cand;
          }),

          short_listed: vacaCandidates.short_listed.filter((cnd) => {
            if (cnd !== req.user.id) return cnd;
          }),
        }
      )
        .then(async (vaca) => {
          //remove application from user applications list

          await User.findOneAndUpdate(
            { _id: req.user.id },
            {
              applications: userApplications.applications.filter((appl) => {
                if (String(appl) !== String(app._id)) {
                  // console.log(String(app._id) === String(appl));
                  return appl;
                }
              }),
            }
          );
        })
        .then((user) => {
          //remove application for short listed list
          res
            .status(httpStatuscode.OK)
            .json({ success: "Application deleted" });
        });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(httpStatuscode.NOT_IMPLEMENTED)
        .json({ Error: "Could not delete application" });
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

const ShortList = async (req, res) => {
  const { id } = req.params;
  const application = await Application.findOne({ _id: id });

  const vacancy = await Vacancy.findOne({ _id: application.vacancy });

  if (vacancy.short_listed.indexOf(id) !== -1)
    return res
      .status(httpStatuscode.NOT_MODIFIED)
      .json({ Error: "Application already short-listed" });
  if (!application)
    return res
      .status(httpStatuscode.NOT_FOUND)
      .json({ Error: "Application does not exists" });

  if (vacancy.employer.id !== req.user.id)
    return res
      .status(httpStatuscode.UNAUTHORIZED)
      .json({ Error: "You cannot perform this action on someone`s vacancy" });

  await Application.findOneAndUpdate({ _id: id }, { status: "short-listed" })
    .then(async (app) => {
      await Vacancy.findOneAndUpdate(
        { _id: application.vacancy },
        {
          short_listed: [...vacancy.short_listed, application.employee],
        }
      ).then((vaca) => {
        res
          .status(httpStatuscode.OK)
          .json({ success: "application short-listeda" });
      });
    })
    .catch((err) => {
      res.status(httpStatuscode.NOT_IMPLEMENTED).json({
        Error: `Failed to shortlist candidate. Reason :${err.message}`,
      });
    });
};
module.exports = {
  apply,
  deleteApp,
  getApp,
  rejectApp,
  ShortList,
};
