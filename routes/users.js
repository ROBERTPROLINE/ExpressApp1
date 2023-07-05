"use strict";
var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth_middleware");
const {
  login,
  signup,
  account_info,
  update_account
} = require("../controllers/authentication");

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/account").get(auth, account_info);
router.route("/account").patch(auth, update_account);

module.exports = router;
