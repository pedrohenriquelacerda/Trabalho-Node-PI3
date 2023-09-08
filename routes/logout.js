var express = require("express");
var router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
