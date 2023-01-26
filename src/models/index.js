import Header from "./headers";
import Request from "./request";
import User from "./user";

User.hasMany(Request);
Request.belongsTo(User);

Request.hasMany(Header);
Header.belongsTo(Request);

await Promise.all([
  User.sync({ alter: true }),
  Request.sync({ alter: true }),
  Header.sync({ alter: true }),
]);

export {
    User,
    Request,
    Header
}