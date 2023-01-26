import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("postman-db", "user", "pass", {
  dialect: "sqlite",
  host: "./config/db.sqlite",
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected To DB");
  } catch (error) {
    console.log(error, "Connection Failed");
    process.exit();
  }
};
