const {DataTypes}=require("sequelize");
const {sequelize}= require("../database/database");

const User = sequelize.define(
    "User",
    {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email:{
            type: DataTypes.STRING,
            allowNull:false,
            unique:true,
            validate: {
                isEmail:true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        role:{
            type: DataTypes.ENUM('user', 'admin', 'travelagent', 'guide'),
            defaultValue:'user',
        },
        status:{
            type: DataTypes.STRING,
            defaultValue:'pending'
        }
    },
    {
        tableName: "users",
        timestamps: true,
    }
);

module.exports  = User;