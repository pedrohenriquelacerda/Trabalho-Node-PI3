var express = require("express");
var router = express.Router();
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Conectado!");
});

router.post("/", function (req, res) {
  req.session.amigoid = req.body["idUser"];
  req.session.capivaraid = req.body["idCapivara"];
  var amigoid = req.body["idUser"];
  var capivaraid = req.body["idCapivara"];
  res.render("chat", {
    amigoid: amigoid,
    capivaraid: capivaraid,
    title: "Chat"
  });
});

router.post("/recebemensagens", function (req, res) {
  usuario_logado = req.session.passport.user.id;
  amigo = req.session.amigoid;

  var sql =
    "INSERT INTO chats (enviou_id, recebeu_id, mensagem, lida) VALUES ?";
  var values = [[usuario_logado, amigo, req.body["mensagem"], 0]];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Numero de registros inseridos: " + result.affectedRows);
  });
  res.send("Mensagem salva");
});

router.post("/buscamensagens", function (req, res) {
  usuario_logado = req.session.passport.user.id;
  foto_logado = req.session.passport.user.imagem;
  amigo = req.session.amigoid;
  console.log("Amigo: " + amigo);
  retorno = "";
  var sql = "SELECT * FROM usuarios where id= ? ORDER BY id;";
  con.query(sql, amigo, function (err, result, fields) {
    if (err) throw err;
    console.log(result[0]["nome"]);
    foto_amigo = result[0]["imagem"];
    valores = [usuario_logado, amigo, amigo, usuario_logado];

    //sql5 = "SELECT COUNT(id) FROM `chats` WHERE lida=0 && recebeu_id=?"
    //valores = [usuario_logado];

    sql2 =
      "SELECT * FROM chats WHERE (enviou_id=? && recebeu_id= ?) or (enviou_id=? && recebeu_id= ?) ORDER BY id  LIMIT 500;";

    con.query(sql2, valores, function (err, mensagens, fields) {
      if (mensagens.length > 0) {
        sql3 = "UPDATE chats set lida = 1 where id<=? && recebeu_id= ?";
        valores = [mensagens[mensagens.length - 1]["id"], usuario_logado];
        con.query(sql3, valores, function (err, mensagens, fields) {
          if (err) throw err;
        });
      } else {
        console.log("Não há mensagens disponíveis");
      }
      if (err) throw err;
      mensagens.forEach(function (dados) {
        if (usuario_logado == dados["enviou_id"]) {
          retorno =
            retorno +
            "<div class='media media-chat media-chat-reverse'>" +
            "<img class='avatar' src=imagens/" +
            foto_logado +
            ">" +
            "<div class='media-body'>" +
            "<p>" +
            dados["mensagem"] +
            "</p>" +
            "</div>" +
            "</div>" +
            "<div class='media media-meta-day'> </div>";
        } else {
          retorno =
            retorno +
            "<div class='media media-chat'>" +
            "<img class='avatar' src=imagens/" +
            foto_amigo +
            ">" +
            "<div class='media-body'>" +
            "<p>" +
            dados["mensagem"] +
            "</p>" +
            "</div>" +
            "</div>" +
            "<div class='media media-meta-day'> </div>";
        }
      });
      res.send(JSON.stringify(retorno));
    });
  });
});

module.exports = router;
