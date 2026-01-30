const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const Package = sequelize.define(
    "Package",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        agentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', 
                key: 'id'
            }
        },
        packageName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT, 
            allowNull: false,
        },
        durationDays: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        maxGroupSize: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        availability: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        packageImage: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'default-package.png'
        }
    },
    {
        tableName: "packages",
        timestamps: true,
    }
);

module.exports = Package;