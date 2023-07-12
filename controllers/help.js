const httpStatuscode = require("http-status-codes").StatusCodes;
const Help = require("../models/help");

const sendHelp = async (req, res) => {
  const { message } = req.body;

  await Help.create({
    user: req.user.id,
    message,
    date: new Date(),
    status: "not-seen",
  })
    .then((help) => {
      res.status(httpStatuscode.OK).json({ success: "message recieved" });
    })
    .catch((err) => {
      console.log(err);
      res.status(httpStatuscode.NOT_MODIFIED).json({ Error: err.message });
    });
};

module.exports = {
  sendHelp,
};
