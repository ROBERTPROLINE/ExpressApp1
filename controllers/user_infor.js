const httpStatuscode = require("http-status-codes").StatusCodes;
const User = require("../models/users");
const Vacancy = require("../models/vacancy");
const Application = require("../models/application");

const getInfor = async (req, res) => {
  const { vacancy } = req.params;
  const vaca_user_data = [];

  const vaca = await Vacancy.findOne({ _id: vacancy });

  const candidates = vaca.candidates;
  candidates.forEach(async (cand, index) => {
    //console.log(cand);
    const userData = await User.findOne({ _id: cand });
    const appl = await Application.findOne({
      employee: cand,
      vacancy: vacancy,
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
        skills: userData.skills,
      },
      appl,
    });
    if (index === candidates.length - 1)
      return res.json({ users: vaca_user_data });
  });
};

module.exports = {
  getInfor,
};
