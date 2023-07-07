const router = require("express").Router();
const {
  apply,
  deleteApp,
  getApp,
  rejectApp,
  ShortList,
} = require("../controllers/application_controller");
const auth = require("../middleware/auth_middleware");

router.route("/").post(auth, apply);
router
  .route("/:id")
  .delete(auth, deleteApp)
  .patch(auth, rejectApp)
  .post(auth, ShortList)
  .get(auth, getApp);

module.exports = router;
