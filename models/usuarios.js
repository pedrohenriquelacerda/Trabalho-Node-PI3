const database = require("../db");
const Sequelize = require("sequelize");
const Capivaras = require("./capivaras"); 

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

// Defina a relação entre Usuários e Capivaras
Usuarios.hasMany(Capivaras, { foreignKey: "usuarioId" });
Capivaras.belongsTo(Usuarios, { foreignKey: "usuarioId" });

module.exports = Usuarios;
