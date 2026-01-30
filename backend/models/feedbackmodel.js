const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const Feedback = sequelize.define("feedback", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    customerId: { 
        type: DataTypes.INTEGER, 
        allowNull: true
    },
    agentId: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
    },
    guideId: {
        type: DataTypes.INTEGER,
        allowNull: true 
    }, 
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: "feedbacks",
    timestamps: true,
});

module.exports = Feedback;