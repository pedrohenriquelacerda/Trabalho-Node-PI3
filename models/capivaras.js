const database = require("../db");
const Sequelize = require("sequelize");

const Capivaras = database.define("capivaras", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: { type: Sequelize.STRING, allowNull: false },
  descricao: { type: Sequelize.STRING, allowNull: false },
  idade: { type: Sequelize.INTEGER, allowNull: false },
  imagem: { type: Sequelize.STRING, allowNull: true },
  usuarioId: {
    // Chave estrangeira para o usuário
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "usuarios", 
      key: "id",
    },
  },
});

module.exports = Capivaras;
