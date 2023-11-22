var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Conectado!");

  var createDbSql = "CREATE DATABASE IF NOT EXISTS capivarias";
  con.query(createDbSql, function (err, result) {
    if (err) throw err;

    if (result.warningCount === 0) {
      console.log("Base de dados criada");
    } else {
      console.log("Erro ao criar o banco de dados");
    }
  });

  con.end();
});
