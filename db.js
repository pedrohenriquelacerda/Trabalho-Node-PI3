const Sequelize = require("sequelize");
const sequelize = new Sequelize("node", "root", "", {
  dialect: "mysql",
  host: "localhost",
  query: { raw: true },
  define: { timestamps: false },
});

module.exports = sequelize;
