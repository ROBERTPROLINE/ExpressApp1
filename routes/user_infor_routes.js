const router = require("express").Router();
const auth = require("../middleware/auth_middleware");
const { getInfor } = require("../controllers/user_infor");

router.route("/:vacancy").get(auth, getInfor);

module.exports = router;

