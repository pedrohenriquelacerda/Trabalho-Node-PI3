var express = require("express");
var router = express.Router();

router.get("/listar", function (req, res, next) {
  res.render("capivaraListar", {
    title: "Listar capivaras",
  });
});

router.get("/cadastrar", function (req, res, next) {
  res.render("capivaraCadastrar", {
    title: "Cadastrar capivara",
  });
});

module.exports = router;