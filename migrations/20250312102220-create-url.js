"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("urls", {
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
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
      deletedAt:{
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue:null
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("urls");
  },
};
