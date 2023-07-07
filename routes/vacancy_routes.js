const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth_middleware");
const {
  createVaca,
  updateVaca,
  deleteVaca,
  getAllVaca,
  getCategory,
  getMyVaca,
  getVaca,
  updateContent,
  GetShortListed,
} = require("../controllers/vaca_contollers");

router.route("/").post(auth, createVaca).get(auth, getAllVaca);
router.route("/category").get(auth, getCategory);
router.route("/:id").patch(auth, updateVaca);
router.route("/:id").delete(auth, deleteVaca);
router.route("/:id").get(auth, getVaca);
router.route("/short-listed/:id").get(auth, GetShortListed);
router.route("/pref").get(getMyVaca);

router.route("/:id/:category").patch(auth, updateContent);
module.exports = router;
