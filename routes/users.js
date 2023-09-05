const express = require("express");
const router = express.Router();

// Você pode adicionar funcionalidades relacionadas aos usuários aqui, como exibir informações do usuário, atualizar informações, excluir, etc.

router.get("/", function (req, res, next) {
  res.send("Lista de Usuários"); // Você pode personalizar isso conforme suas necessidades.
});

module.exports = router;