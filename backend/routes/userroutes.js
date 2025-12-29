
const express= require("express").Router();

const { addUser, getActiveUsers, getAllUsers, getUsersById, updateUser, deleteUser, loginUser } = require('../controllers/userController')

express.post("/register", addUser);
express.post("/register", getActiveUsers);
express.get("/getallUsers", getAllUsers);
express.get("/getUserByid/:uid", getUsersById);
express.put("/updateUserByid/:id", updateUser);
express.delete("/deleteUserByid", deleteUser);
express.post ("/login",loginUser);


module.exports=express;