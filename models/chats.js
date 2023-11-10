const database = require("../db");
const Sequelize = require("sequelize");
const sequelize = require("../db");

const Chats = database.define("chats", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  
  enviou_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id",
    },
  },
  mensagem: { type: Sequelize.STRING, allowNull: false },

  recebeu_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id",
    },
  },

  lida: { type: Sequelize.BOOLEAN, allowNull: false }
});

module.exports = Chats;
