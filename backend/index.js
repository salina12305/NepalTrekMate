
const express = require("express");
const app = express();
const { sequelize, connectDB }= require("./database/database");

app.use(express.json());

app.use("/api/user/",require('./routes/userroutes'))

app.get("/",(req,res)=>{
    res.json({message:"Welcome to the Home Page"});
});

const startServer = async () => {
    await connectDB();
    await sequelize.sync();
    app.listen(3000, ()=>{
        console.log('Server is running on port ${3000}');
    });
};
startServer();