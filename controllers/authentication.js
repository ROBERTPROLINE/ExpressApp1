const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const httpStatuscode = require("http-status-codes").StatusCodes;

const User = require("../models/users");
const userTokens = require("../models/userTokens");
//.env configuration
require("dotenv").config();

const updateProfile = async (req, res) => {
  if (req.filename)
    return res.status(httpStatuscode.OK).json({ success: "update done" });
};
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(httpStatuscode.OK)
      .json({ error: "username or password required" });

  await User.findOne({ username })
    .then(async (userdata) => {
      if (!userdata || userdata === null || userdata === undefined) {
        return res
          .status(httpStatuscode.UNAUTHORIZED)
          .json({ error: "username/password mismatch" });
      }

      const validPassword = bcrypt.compare(password, userdata.password);

      if (!validPassword) {
        return res
          .status(httpStatuscode.UNAUTHORIZED)
          .json({ error: "username/password mismatch" });
      }

      const { username, status, _id, fullname } = userdata;
      req.user = { username, status, _id, fullname };

      generateToken(req, res);
    })
    .catch((err) => {
      return res.status(httpStatuscode.OK).json({ error: err.message });
    });
};

const signup = async (req, res) => {
  //create new account
  const { username, password, email, fullname } = req.body;
  if (!username || !password || !email || !fullname)
    return res
      .status(httpStatuscode.UNAUTHORIZED)
      .json({ error: "username/password/email required" });

  const userExists = User.findOne({ username })
    .then(async (userdata) => {
      if (userdata) {
        return res
          .status(httpStatuscode.CONFLICT)
          .json({ error: "username already taken" });
      }
      const emailExists = User.findOne({ email }).then(async (emailData) => {
        if (emailData)
          return res
            .status(httpStatuscode.CONFLICT)
            .json({ error: "email already taken" });

        hashedPAssword = await bcrypt.hash(password, 10);
        await User.create({
          fullname,
          username,
          password: hashedPAssword,
          email,
        }).then(async (newUser) => {
          const { username, status, _id } = newUser;
          req.user = { username, status, _id };

          generateToken(req, res);
        });
      });
    })
    .catch((err) => {
      res.status(httpStatuscode.OK).json({ error: err.message });
    });
};

const account_info = async (req, res) => {
  await User.findOne({ _id: req.user.id })
    .then(async (userData) => {
      res.status(httpStatuscode.OK).json({ account: userData });
    })
    .catch((err) => {
      res.status(httpStatuscode.NOT_FOUND).json({ error: "account not found" });
    });
};

const update_account = async (req, res) => {
  //update skills industry profession experience
  const { skills, industry, profession, experience } = req.body;
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { skills, industry, profession, experience }
  ).then((data) => {
    res.status(httpStatuscode.OK).json({ success: "update done" });
  });
};

const generateToken = async (req, res) => {
  //save current valid token i db
  const accessToken = await jwt.sign(
    { username: req.user.username, status: req.user.status, id: req.user._id },
    process.env.ACCESS_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = await jwt.sign(
    { username: req.user.username, status: req.user.status, id: req.user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "3d" }
  );

  await userTokens
    .findOne({ user: req.user.username })
    .then(async (userdata) => {
      if (userdata) {
        return await userTokens.findOneAndUpdate(
          { user: req.user.username },
          { refresh: refreshToken, access: accessToken }
        );
      }

      await userTokens.create({
        user: req.user.username,
        refresh: refreshToken,
        access: accessToken,
      });
    })
    .catch((err) => {
      return res.json({ error: err.message });
    });

  res
    .status(httpStatuscode.OK)
    .json({
      access: accessToken,
      refresh: refreshToken,
      userid: req.user._id,
      fullname: req.user.fullname,
    });
};

module.exports = {
  login,
  signup,
  account_info,
  updateProfile,
  update_account,
};
