const bcrypt = require("bcryptjs");
const express = require("express");
const formidable = require("formidable");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const Usuario = require("../models/usuarios");
var saltRounds = 10;

router.get("/", function (req, res) {
  let mensagem = null;

  if (req.query.erro == 1) {
    mensagem = "Campo incorreto";
  } else if (req.query.erro == 2) {
    mensagem = "Email e/ou senha incorretos!";
  }

  res.render("cadastro", {
    title: "cadastro",
    mensagem,
  });
});

router.post("/", async function (req, res) {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) throw err;
      bcrypt.hash(
        fields["senha"][0],
        saltRounds,
        function (err, hashedPassword) {
          var oldpath = files.imagem[0].filepath;
          var hash = crypto
            .createHash("md5")
            .update(Date.now().toString())
            .digest("hex");
          var nomeimg =  hash + "." + files.imagem[0].mimetype.split("/")[1];
          var newpath = path.join(__dirname, "../public/imagens/", nomeimg);
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
          });

          Usuario.create({
            nome: fields["nome"][0],
            senha: hashedPassword,
            email: fields["email"][0],
            imagem: nomeimg,
          });
          res.redirect("/login?erro=0");
        }
      );
    });
    // Redireciona para a página de login após o cadastro bem-sucedido.
  } catch (err) {
    // Trate erros de validação ou outros erros aqui.
    console.error(err);
    res.redirect("/cadastro?erro=1");
  }
});

module.exports = router;
