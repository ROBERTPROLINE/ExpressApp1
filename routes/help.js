const router = require("express").Router();
const auth = require("../middleware/auth_middleware");
const { sendHelp } = require("../controllers/help");

router.route("/").post(auth, sendHelp);
module.exports = router;
