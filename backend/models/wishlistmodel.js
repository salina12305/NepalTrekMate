const {DataTypes}=require("sequelize");
const {sequelize}= require("../database/database"); // Your DB config

const Wishlist = sequelize.define('Wishlist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    packageId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Wishlist;