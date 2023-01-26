import { DataTypes, Model } from "sequelize";

import { sequelize } from "../config/db";

class Header extends Model {}

Header.init(
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    checked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  sequelize
);

export default Header;
