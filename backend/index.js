
const express = require("express");
const path = require('path');
const cors = require("cors");
const app = express();
const { sequelize, connectDB }= require("./database/database");

const User = require("./models/usermodel");

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads', express.static('public/uploads'));

app.use("/api/user/",require('./routes/userroutes'))

app.get("/",(req,res)=>{
    res.json({message:"Welcome to the Home Page"});
});

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