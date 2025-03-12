"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Url extends Model {
    static associate(models) {}
  }
  Url.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      short_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      long_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Url",
    }
  );
  return Url;
};
