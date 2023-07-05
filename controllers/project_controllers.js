const httpStatuscode = require("http-status-codes").StatusCodes;
const User = require("../models/users");
const Project = require("../models/project");

//controller for vacancies
const createProj = async (req, res) => {
  //create new vacancy
  const { title, category, description } = req.body;
  if (!title || !category || !description) {
    return res
      .status(httpStatuscode.NO_CONTENT)
      .json({ error: "title, category, description required" });
  }

  await Project.create({
    title,
    category,
    description,
    owner: req.user.username,
    status: "open",
  })
    .then((data) => {
      return res.status(httpStatuscode.OK).json({ success: "project created" });
    })
    .catch((err) => {
      return res.json({ error: err.message });
    });
};

const uploadAdditonalfiles = async (req, res) => {
  //handle upload of additional files
};

const updateProj = async (req, res) => {
  //update vacancy that i created
  const { id } = req.params;
  const { requirements, status } = req.body;
  await Project.findOneAndUpdate(
    { _id: id, owner: req.user.username },
    { salary, status, requirements }
  )
    .then((data) => {
      if (!data)
        return res
          .status(httpStatuscode.NOT_FOUND)
          .json({ error: "project does not exist" });
      return res.status(httpStatuscode.OK).json({ success: "update done" });
    })
    .catch((err) => {
      return res.json({ error: err.message });
    });
};

const deleteProj = async (req, res) => {
  //delete my vacancy
  const { id } = req.params;
  await Project.findOneAndDelete({
    _id: id,
    owner: req.user.username,
  }).then((deleted) => {
    if (!deleted) {
      return res
        .status(httpStatuscode.NOT_FOUND)
        .json({ error: "project not found" });
    }

    res.status(httpStatuscode.OK).json({ success: "project deleted" });
  });
};

const getProj = async (req, res) => {
  //get single vanacy
  const { id } = req.params;
  await Project.findOne({ _id: id })
    .then(async (project) => {
      if (!project) {
        return res
          .status(httpStatuscode.NOT_FOUND)
          .json({ error: "project does not exists" });
      }

      return res.status(httpStatuscode.OK).json({ project });
    })
    .catch((err) => {
      return res.status(httpStatuscode.NO_CONTENT).json({ error: err.message });
    });
};

const getAllProj = async (req, res) => {
  //get all available vancies
  //let found = [];
  await Project.find()
    .then(async (projects) => {
      let found = projects.map((proj) => {
        return (
          (new Date(proj.closingDate) > new Date(Date.now())) &
          (proj.status === "open")
        );
      });

      return res.status(httpStatuscode.OK).json({ projects: found });
    })
    .catch((err) => {
      return res.status(httpStatuscode.NOT_FOUND).json({ error: err.message });
    });
};

const getMyProj = async (req, res) => {
  //get vacancies that match my account
  /**
   * a more sofisticated search algorithim needed
   */
  const projects = await Project.find({})
    .then(async (pros) => {
      await User.find({ _id: req.user.id }).then((user) => {
        let userProjects = pros.map((pro) => {
          if (user.skills.indexOf(pro.category) !== -1) {
            return pro;
          }
        });

        return res.status(httpStatuscode.OK).json({ projects: userProjects });
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

  await Project.find({ category })
    .then((projects) => {
      let found = projects.map((proj) => {
        return (
          (new Date(proj.closingDate) > new Date(Date.now())) &
          (proj.status === "open")
        );
      });

      if (found.length === 0) {
        return res
          .status(httpStatuscode.NOT_FOUND)
          .json({ error: "no vacancies found" });
      }
      res.status(httpStatuscode.OK).json({ projects: found });
    })
    .catch((err) => {
      res.status(httpStatuscode.NOT_FOUND).json({ error: err.message });
    });
};

module.exports = {
  createProj,
  updateProj,
  deleteProj,
  getAllProj,
  getCategory,
  getMyProj,
  getProj,
};
