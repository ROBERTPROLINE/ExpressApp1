const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth_middleware");
const {
  createProj,
  updateProj,
  deleteProj,
  getAllProj,
  getCategory,
  getMyProj,
  getProj,
} = require("../controllers/project_controllers");

router.route("/").post(auth, createProj).get(auth, getAllProj);
router.route("/category").get(auth, getCategory);
router.route("/:id").patch(auth, updateProj);
router.route("/:id").delete(auth, deleteProj);
router.route("/:id").get(auth, getProj);
router.route("/pref").get(getMyProj);

module.exports = router;
