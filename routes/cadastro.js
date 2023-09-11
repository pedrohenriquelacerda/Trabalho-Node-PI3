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
    mensagem = "Algo não deu certo";
  } else if (req.query.erro == 2) {
    mensagem = "Senhas não coincidem";
  } else if (req.query.erro == 3) {
    mensagem = "Email já cadastrado";
  } else if (req.query.erro == 4) {
    mensagem = "Arquivo de imagem inválido";
  }

  res.render("cadastro", {
    title: "cadastro",
    mensagem,
  });
});

router.post("/", async function (req, res) {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.redirect("/cadastro?erro=1");
      }

      const senha = fields["senha"][0];
      const rsenha = fields["rsenha"][0];

      // Verifica se as senhas coincidem
      if (senha !== rsenha) {
        console.error("As senhas não coincidem.");
        return res.redirect("/cadastro?erro=2");
      }

      // Verifica se o email já está cadastrado
      const existeUser = await Usuario.findOne({
        where: { email: fields["email"][0] },
      });
      if (existeUser) {
        console.error("Email já cadastrado.");
        return res.redirect("/cadastro?erro=3");
      }

      const hashedPassword = await bcrypt.hash(senha, saltRounds);

      // Verifica se um arquivo de imagem foi enviado
      if (files.imagem[0] && files.imagem[0].size > 0) {
        const file = files.imagem[0];

        const hash = crypto
          .createHash("md5")
          .update(Date.now().toString())
          .digest("hex");

        console.log(file.mimetype);
        const fileExt = file.mimetype.toLowerCase();

        if (
          !["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(
            fileExt
          )
        ) {
          console.log("O arquivo de imagem não possui uma extensão válida");
          return res.redirect("/cadastro?erro=4");
        }

        const nomeimg = hash + "." + files.imagem[0].mimetype.split("/")[1];
        const newpath = path.join(__dirname, "../public/imagens/", nomeimg);

        fs.rename(files.imagem[0].filepath, newpath, function (err) {
          if (err) {
            console.error(err);
            return res.redirect("/cadastro?erro=1");
          }
          console.log("Arquivo de imagem enviado com sucesso");
          Usuario.create({
            nome: fields["nome"][0],
            senha: hashedPassword,
            email: fields["email"][0],
            imagem: nomeimg,
          });

          return res.redirect("/login?erro=0");
        });
      } else {
        console.log("Nenhum arquivo de imagem foi enviado");
        Usuario.create({
          nome: fields["nome"][0],
          senha: hashedPassword,
          email: fields["email"][0],
          imagem: null,
        });

        return res.redirect("/login?erro=0");
      }
    });
  } catch (err) {
    console.error(err);
    res.redirect("/cadastro?erro=1");
  }
});

module.exports = router;
