const express = require("express");
const router = express.Router();
const Capivaras = require("../models/capivaras");
const Usuarios = require("../models/usuarios");
const formidable = require("formidable");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

// Cadastrar capivaras
router.get("/cadastrar", function (req, res, next) {
  mensagem = null;

  if (req.query.erro == 1) {
    mensagem = "Algo não deu certo";
  } else if (req.query.erro == 2) {
    mensagem = "Os campos nome e idade são obrigatórios";
  } else if (req.query.erro == 3) {
    mensagem = "Arquivo de imagem inválido";
  }

  res.render("capivaraCadastrar", {
    title: "Cadastrar capivara",
    mensagem: mensagem,
  });
});

router.post("/cadastrar", async function (req, res) {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.redirect("/capivara/cadastrar?erro=1");
      }

      const nome = fields["nome"][0];
      const idade = fields["idade"][0];
      const descricao = fields["descricao"][0];

      if (nome.length == 0 && idade.length == 0) {
        return res.redirect("/capivara/cadastrar?erro=2");
      }

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
          return res.redirect("/capivara/cadastrar?erro=4");
        }

        const nomeimg = hash + "." + files.imagem[0].mimetype.split("/")[1];
        const newpath = path.join(
          __dirname,
          "../public/imagens/capivara",
          nomeimg
        );

        fs.rename(files.imagem[0].filepath, newpath, function (err) {
          if (err) {
            console.error(err);
            return res.redirect("/capivara/cadastrar?erro=1");
          }
          console.log("Arquivo de imagem enviado com sucesso");

          if (res.locals.id == undefined) {
            Capivaras.create({
              nome: nome,
              idade: idade,
              descricao: descricao,
              imagem: nomeimg,
              usuarioId: null,
            });
          } else {
            Capivaras.create({
              nome: nome,
              idade: idade,
              descricao: descricao,
              imagem: nomeimg,
              usuarioId: res.locals.id,
            });
          }

          return res.redirect("/capivara/listar?erro=0");
        });
      } else {
        console.log("Nenhum arquivo de imagem foi enviado");
        if (res.locals.id == undefined) {
          Capivaras.create({
            nome: nome,
            idade: idade,
            descricao: descricao,
            imagem: null,
            usuarioId: null,
          });
        } else {
          Capivaras.create({
            nome: nome,
            idade: idade,
            descricao: descricao,
            imagem: null,
            usuarioId: res.locals.id,
          });
        }
        console.log(res.locals.id);
        return res.redirect("/capivara/listar?erro=0");
      }
    });
  } catch (err) {
    console.error(err);
    res.redirect("/capivara/cadastrar?erro=1");
  }
});

// Listar capivaras
router.get("/listar", async function (req, res, next) {
  try {
    const capivaras = await Capivaras.findAll({
      raw: true,
      include: [
        {
          model: Usuarios,
          as: "usuario",
          attributes: ["nome"],
        },
      ],
    });

    let mensagemSucesso = null;
    let mensagemErro = null;

    if (req.query.erro == 0) {
      mensagemSucesso = "Capivara cadastrada com sucesso";
    } else if (req.query.erro == 1) {
      mensagemSucesso = "Capivara deletada com sucesso";
    } else if (req.query.erro == 2) {
      mensagemSucesso = "Capivara editada com sucesso";
    } else if (req.query.erro == 3) {
      mensagemErro = "Você não pode excluir essa capivara";
    } else if (req.query.erro == 4) {
      mensagemErro = "Você não pode editar essa capivara";
    }

    res.render("capivaraListar", {
      title: "Listar capivaras",
      mensagemSucesso: mensagemSucesso,
      mensagemErro: mensagemErro,
      capivaras: capivaras,
    });
  } catch (error) {
    next(error);
  }
});

// Deletar capivaras
router.get("/deletar/:id", async function (req, res, next) {
  try {
    const capivara = await Capivaras.findByPk(req.params.id);

    if (capivara == null) {
      return res.redirect("/capivara/listar?erro=1");
    } else if (capivara.usuarioId != res.locals.id) {
      return res.redirect("/capivara/listar?erro=2");
    } else {
      imagem = capivara.imagem;
      caminho = "./public/imagens/capivara/" + imagem;
      fs.unlink(caminho, (err) => {
        if (err) {
          console.error("Erro ao deletar o arquivo:", err);
          return;
        }
      });

      await Capivaras.destroy({
        where: {
          id: req.params.id,
        },
      });
    }
    return res.redirect("/capivara/listar?erro=1");
  } catch (error) {
    next(error);
  }
});

// Editar capivaras
router.get("/editar/:id", async function (req, res, next) {
  try {
    const capivara = await Capivaras.findByPk(req.params.id);

    if (capivara == null) {
      return res.redirect("/capivara/listar?erro=2");
    } else if (capivara.usuarioId != res.locals.id) {
      return res.redirect("/capivara/listar?erro=4");
    }

    res.render("capivaraEditar", {
      title: "Editar capivara",
      mensagem: null,
      capivara: capivara,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/editar", async function (req, res, next) {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      const capivaraId = fields["id"][0];
      const capivara = await Capivaras.findByPk(capivaraId);

      if (capivara == null) {
        return res.redirect("/capivara/listar?erro=2");
      } else if (capivara.usuarioId != res.locals.id) {
        return res.redirect("/capivara/listar?erro=4");
      }

      if (err) {
        console.error(err);
        return res.redirect(`/capivara/editar/${capivaraId}?erro=1`);
      }

      const nome = fields["nome"][0];
      const idade = fields["idade"][0];
      const descricao = fields["descricao"][0];

      if (files.imagem[0] && files.imagem[0].size > 0) {
        const file = files.imagem[0];

        const hash = crypto
          .createHash("md5")
          .update(Date.now().toString())
          .digest("hex");

        const fileExt = file.mimetype.toLowerCase();

        if (
          !["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(
            fileExt
          )
        ) {
          console.log("O arquivo de imagem não possui uma extensão válida");
          return res.redirect(`/capivara/editar/${capivaraId}?erro=3`);
        }

        const nomeimg = hash + "." + files.imagem[0].mimetype.split("/")[1];
        const newpath = path.join(
          __dirname,
          "../public/imagens/capivara",
          nomeimg
        );

        if (capivara.imagem) {
          const caminhoImagemAntiga = path.join(
            __dirname,
            `../public/imagens/capivara/${capivara.imagem}`
          );

          await fs.promises
            .unlink(caminhoImagemAntiga)
            .catch((err) => console.error(err));
        }

        await fs.promises.rename(file.filepath, newpath);

        await Capivaras.update(
          {
            nome: nome,
            idade: idade,
            descricao: descricao,
            imagem: nomeimg,
          },
          {
            where: {
              id: capivaraId,
            },
          }
        );

        return res.redirect("/capivara/listar?erro=2");
      } else {
        await Capivaras.update(
          {
            nome: nome,
            idade: idade,
            descricao: descricao,
          },
          {
            where: {
              id: capivaraId,
            },
          }
        );

        return res.redirect("/capivara/listar?erro=2");
      }
    });
  } catch (err) {
    console.error(err);
    res.redirect(`/capivara/editar/${req.params.id}?erro=1`);
  }
});

module.exports = router;
