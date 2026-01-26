
const express = require("express");
const app = express();
const { sequelize, connectDB }= require("./database/database");

app.use(express.json());

app.use("/api/user/",require('./routes/userroutes'))

app.get("/",(req,res)=>{
    res.json({message:"Welcome to the Home Page"});
});

const PORT = 3000;
const startServer = async () => {
    try{
    await connectDB();
    await sequelize.sync({alter: true});
    console.log("Database synced successfully");
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    });
}catch(error){
    console.error("Error starting server:", error);
}
};
startServer();