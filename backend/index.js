
const express = require("express");
const path = require('path');
const cors = require("cors");
const { sequelize, connectDB }= require("./database/database");

// 1. IMPORT MODELS (Necessary for relationships)
const User = require("./models/usermodel");
const Package = require("./models/packagemodel"); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads', express.static('public/uploads'));

// 2. DEFINE ROUTES
app.use("/api/user/",require('./routes/userroutes'))
app.use("/api/packages", require('./routes/packageroutes')); 

app.get("/",(req,res)=>{
    res.json({message:"Welcome to the Home Page"});
});

// This tells Sequelize how to link the tables in pgAdmin 4
User.hasMany(Package, { foreignKey: 'agentId', as: 'packages' });
Package.belongsTo(User, { foreignKey: 'agentId', as: 'agent' });

const PORT = 3000;

const startServer = async () => {
    try{
       await connectDB();
       await sequelize.sync({ alter: true });

       app.listen(PORT, ()=>{
           console.log(`Server is running on port ${PORT}`);
       });
    }catch (error){
        console.error("Failed to start server:", error);
    }
};

startServer();