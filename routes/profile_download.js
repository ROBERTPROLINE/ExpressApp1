const router = require("express").Router();
const path = require("path");

router.route("/:user").get((req, res) => {
  const { user } = req.params;
  res.sendFile(
    path.join(__dirname, "../static", "userprofiles", `${user}.png`)
  );
});

module.exports = router;
