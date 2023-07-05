const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const httpStatuscode = require("http-status-codes").StatusCodes;
const userTokens = require("../models/userTokens");

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || token.split(" ")[0] !== "Bearer")
    return res
      .status(httpStatuscode.FORBIDDEN)
      .json({ error: "session id not found" });

  const validToken = jwt.verify(
    token.split(" ")[1],
    process.env.ACCESS_SECRET,
    async (error, data) => {
      if (error) {
        return res
          .status(httpStatuscode.FORBIDDEN)
          .json({ error: "invalid session id" });
      }

      const { username, status, id } = data;
      const tk = await userTokens
        .findOne({ user: username, access: token.split(" ")[1] })
        .then((data) => {
          //onsole.log(token.split(" ")[1], " - ", username);
          //console.log(data);
          if (!data) {
            return res
              .status(httpStatuscode.UNAUTHORIZED)
              .json({ error: "token blocked" });
          }

          req.user = { username, status, id };
          next();
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(httpStatuscode.UNAUTHORIZED)
            .json({ error: err.message });
        });
      //console.log(tk);
    }
  );
};

module.exports = auth;
