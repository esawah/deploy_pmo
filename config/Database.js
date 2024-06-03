import { Sequelize } from "sequelize";

// const db = new Sequelize("indodaya", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

const db = new Sequelize("PMO_Admin_Database", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
