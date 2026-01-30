const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const Booking = sequelize.define("Booking", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    guideId: { 
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    packageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: { 
        type: DataTypes.STRING,
        defaultValue: 'pending',
    },
    paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'paid'),
        defaultValue: 'unpaid',
    }
}, {
    tableName: "bookings",
    timestamps: true,
});

module.exports = Booking;