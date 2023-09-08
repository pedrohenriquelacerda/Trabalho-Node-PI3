const database = require("../db");
const Sequelize = require("sequelize");
const Usuarios = database.define("usuarios", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false },
  senha: { type: Sequelize.STRING, allowNull: false },
  imagem: { type: Sequelize.STRING, allowNull: true },
});

module.exports = Usuarios;
