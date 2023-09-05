const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res, next) => {
  let mensagem = null;
  
  if (req.query.erro == 1) {
    mensagem = "É necessário realizar login";
    
  } else if (req.query.erro == 2) {
    mensagem = "Email e/ou senha incorretos!";
  }
  
  res.render("login", { title: "Login", mensagem });
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/", // Redirecionar para a página principal em caso de sucesso
    failureRedirect: "/login?erro=2", // Redirecionar para a página de login com erro em caso de falha
  })
);

module.exports = router;