//main router for the system
const router = require("express").Router();
const auth = require("../middleware/auth_middleware");
const multer = require("multer");
const { updateProfile } = require("../controllers/authentication");
const fsPromises = require("fs").promises;
//all routes use authmiddleware

const DIR = "./static/userprofiles";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    req.filename = fileName;
    //if()
    cb(null, `${req.user.id}.png`);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.route("/").post(auth, upload.single("profileImg"), updateProfile);

module.exports = router;
