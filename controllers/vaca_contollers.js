const httpStatuscode = require("http-status-codes").StatusCodes;
const User = require("../models/users");
const Vacancy = require("../models/vacancy");
const Application = require("../models/application");

//controller for vacancies
const createVaca = async (req, res) => {
  //create new vacancy
  //console.log(req.body);
  const {
    title,
    industry,
    location,
    duration,
    closingDate,
    description,
    salary,
  } = req.body;
  if (
    !title ||
    !description ||
    !description ||
    !salary ||
    !industry ||
    !location ||
    !duration ||
    !closingDate
  ) {
    return res.json({
      error: "please fill all the required feilds ",
    });
  }

  await User.findOne({ _id: req.user.id })
    .then(async (userData) => {
      await Vacancy.create({
        title,
        industry,
        description,
        duration,
        closingDate,
        location,
        positions: 0,
        skills: [],
        requirements: [],
        duties_and_responsibilies: [],
        candidates: [],
        employer: {
          name: userData.fullname,
          id: req.user.id,
          profile: `http://localhost:5000/profilepicdl/${req.user.id}`,
          address: userData.address,
        },
        applied: 0,
        hired: 0,
        salary,
        status: "open",
      }).then((data) => {
        return res
          .status(httpStatuscode.OK)
          .json({ success: "vacancy created", vaca: data });
      });
    })

    .catch((err) => {
      return res.json({ error: err.message });
    });
};

const updateVaca = async (req, res) => {
  //update vacancy that i created
  const { id } = req.params;
  const { salary, status } = req.body;
  await Vacancy.findOneAndUpdate(
    { _id: id, employer: req.user.username },
    { salary, status }
  )
    .then((data) => {
      if (!data)
        return res
          .status(httpStatuscode.NOT_FOUND)
          .json({ error: "vacancy does not exist" });
      return res.status(httpStatuscode.OK).json({ success: "update done" });
    })
    .catch((err) => {
      return res.json({ error: err.message });
    });
};

const updateContent = async (req, res) => {
  //update skills,  requirements, responsibilities, cover letter, positions
  const { id, category } = req.params;
  const { update } = req.body;

  //console.log("updating category : ", category, " with data : ", update);
  await Vacancy.findOne({ _id: id }).then(async (vacancy) => {
    if (!vacancy)
      return res
        .status(httpStatuscode.NOT_FOUND)
        .json({ error: "Vacancy not found" });

    if (category === "skills") {
      await Vacancy.findOneAndUpdate(
        { _id: id },
        { skills: [...vacancy.skills, update] }
      ).then((vaca) => res.status(httpStatuscode.OK).json({ success: "done" }));
    } else if (category === "duties") {
      await Vacancy.findOneAndUpdate(
        { _id: id },
        {
          duties_and_responsibilities: [
            ...vacancy.duties_and_responsibilities,
            update,
          ],
        }
      ).then((vaca) => res.status(httpStatuscode.OK).json({ success: "done" }));
    } else if (category === "requirements") {
      await Vacancy.findOneAndUpdate(
        { _id: id },
        {
          requirements: [...vacancy.requirements, update],
        }
      ).then((vaca) => res.status(httpStatuscode.OK).json({ success: "done" }));
    } else if (category === "cover_letter") {
      await Vacancy.findOneAndUpdate(
        { _id: id },
        {
          cover_letter: update,
        }
      ).then((vaca) => res.status(httpStatuscode.OK).json({ success: "done" }));
    } else if (category === "positions") {
      await Vacancy.findOneAndUpdate(
        { _id: id },
        {
          positions: update,
        }
      ).then((vaca) => res.status(httpStatuscode.OK).json({ success: "done" }));
    } else if (category === "status") {
      await Vacancy.findOneAndUpdate(
        { _id: id },
        {
          status: update,
        }
      ).then((vaca) => res.status(httpStatuscode.OK).json({ success: "done" }));
    }
    console.log("v.c : ", vacancy[category]);
  });
};

const deleteVaca = async (req, res) => {
  //delete my vacancy
  const { id } = req.params;
  await Vacancy.findOneAndDelete({
    _id: id,
    employer: req.user.username,
  }).then((deleted) => {
    if (!deleted) {
      return res
        .status(httpStatuscode.NOT_FOUND)
        .json({ error: "vacancy not found" });
    }

    res.status(httpStatuscode.OK).json({ success: "vacancy deleted" });
  });
};

const getVaca = async (req, res) => {
  //get single vanacy
  const { id } = req.params;
  //console.log("getting vacancy : ", id);
  if (!id || (id === undefined) | "undefined")
    return res.json({ error: "vaca id required" });
  await Vacancy.findOne({ _id: id })
    .then(async (vacancy) => {
      //console.log("vacancy : ", vacancy);
      if (!vacancy || vacancy === undefined) {
        return res.json({ error: "vacancy does not exists" });
      }

      return res.status(httpStatuscode.OK).json({ vacancy });
    })
    .catch((err) => {
      return res.status(httpStatuscode.NO_CONTENT).json({ error: err.message });
    });
};

const getAllVaca = async (req, res) => {
  //get all available vancies
  //let found = [];
  await Vacancy.find()
    .then(async (vacancies) => {
      let found = vacancies.filter((vaca) => {
        return (
          (new Date(vaca.closingDate) > new Date(Date.now())) &
          (vaca.status === "open")
        );
      });

      return res.status(httpStatuscode.OK).json({ vacancies: found });
    })
    .catch((err) => {
      return res.status(httpStatuscode.NOT_FOUND).json({ error: err.message });
    });
};

const getMyVaca = async (req, res) => {
  //get vacancies that match my account
  /**
   * a more sofisticated search algorithim needed
   */
  const vacancies = await Vacancy.find({})
    .then(async (vacancies) => {
      await User.find({ _id: req.user.id }).then((user) => {
        let userVacancies = vacancies.map((vaca) => {
          if (user.skills.indexOf(vaca.category) !== -1) {
            return vaca;
          }
        });

        return res.status(httpStatuscode.OK).json({ vacancies: userVacancies });
      });
    })
    .catch((err) => {
      return res.status(httpStatuscode.NOT_FOUND).json({ error: err.message });
    });
};

const getCategory = async (req, res) => {
  //get vacancies of certain category
  const { category } = req.body;
  if (!category) {
    return res.json({ error: "category required" });
  }

  await Vacancy.find({ category })
    .then((vacancies) => {
      let found = vacancies.map((vaca) => {
        return (
          (new Date(vaca.closingDate) > new Date(Date.now())) &
          (vaca.status === "open")
        );
      });

      if (found.length === 0) {
        return res
          .status(httpStatuscode.NOT_FOUND)
          .json({ error: "no vacancies found" });
      }
      res.status(httpStatuscode.OK).json({ vacancies: found });
    })
    .catch((err) => {
      res.status(httpStatuscode.NOT_FOUND).json({ error: err.message });
    });
};

const GetShortListed = async (req, res) => {
  const { id } = req.params;

  let vaca_user_data = [];
  const vacancy = await Vacancy.findOne({ _id: id });
  const candidates = vacancy.short_listed;
  candidates.forEach(async (cand, index) => {
    //console.log(cand);
    const userData = await User.findOne({ _id: cand });
    const user = await User.findOne({ _id: cand });
    const appl = await Application.findOne({
      employee: cand,
      vacancy: vacancy._id,
    });
    //console.log(user);
    //console.log(appl);

    vaca_user_data.push({
      user: {
        userid: userData._id,
        fullname: userData.fullname,
        email: userData.email,
        experience: userData.experience,
        profession: userData.profession,
        username: userData.username,
        skills: userData.skills,
      },
      appl,
    });
    if (index === candidates.length - 1)
      return res.json({ users: vaca_user_data });
  });
};
module.exports = {
  createVaca,
  updateVaca,
  deleteVaca,
  getAllVaca,
  getCategory,
  getMyVaca,
  getVaca,
  updateContent,
  GetShortListed,
};
