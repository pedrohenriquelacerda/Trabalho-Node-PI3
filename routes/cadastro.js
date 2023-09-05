const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");
var saltRounds = 10;

router.get("/", function (req, res) {
  res.render('cadastro', { title: 'Cadastro' });
});

router.post("/", async function (req, res) {
  try {
    
    const hashedPassword = await bcrypt.hash(req.body["senha"], saltRounds);

    const novoUsuario = await Usuario.create({
      nome: req.body["nome"],
      senha: hashedPassword,
      email: req.body["email"],
    });

    // Redireciona para a página de login após o cadastro bem-sucedido.
    res.redirect("/login?mensagem=Cadastro realizado com sucesso");
  } catch (err) {
    // Trate erros de validação ou outros erros aqui.
    console.error(err);
    res.redirect("/cadastro?erro=1");
  }
});

module.exports = router;