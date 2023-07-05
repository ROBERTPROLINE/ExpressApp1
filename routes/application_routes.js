const router = require("express").Router();
const {
  apply,
  deleteApp,
  getApp,
} = require("../controllers/application_controller");
const auth = require("../middleware/auth_middleware");

router.route("/").post(auth, apply).delete(auth, apply);
router.route("/:id").delete(auth, deleteApp).get(auth, getApp);

module.exports = router;
