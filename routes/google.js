var express = require('express');
var router = express.Router();
const passport = require("passport");

router.get(
    "/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login?erro=4",
    })
  );

module.exports = router;
