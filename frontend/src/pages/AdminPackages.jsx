const User =require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addUser = async (req,res) => {
    try{
        const{ username, email, password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }
        const isUser = await User.findOne({ where: { username } });
        const isEmail = await User.findOne({ where: { email } });

        if(isUser || isEmail){
            return res.json({
                success:false,
                message:"User with this email exist!!"
            });
        }
        const hashedPassword = await  bcrypt.hash(password,10)
        console.log(hashedPassword)
        const newUser = await User.create({
            username: username,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            success:true,
            message:"User added successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
              },
        });
    } catch (error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message: "Error adding user",
            error:error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } });
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};

const getUsersById  = async (req, res) =>{
    try {
        const id = req.params.uid;
        const user = await User.findByPk(id);
        if (!user)  return res(404).json({message: "User not found" });
        return res.json({
            id: user.id, 
            username: user.username, 
            email: user.email
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error retrieving users", 
            error: error.message 
        });
   }
};

const updateUser  = async (req, res) =>{
    try {
        const id = req.params.id;
        const {username, email, password}= req.body;
        const user = await User.findByPk(id);
        if (!user){
            return res.status(404).json({
                message:"User not found",
            });
        }
        if (username) {
            const isexistinguser = await User.findOne({ where: { username } })
            if (isexistinguser && isexistinguser.id !== user.id) {
              return res.status(400).json({
                success:false,
                message: "user with that username exist!",
              });
            }
        let hashedPassword= user.password;
        if(password){
            hashedPassword= await bcrypt.hash(password,10);
        }
        await user.update({
            username: username || user.username,
            email: email || user.email,
            password: hashedPassword,
            });
        return res.status(200).json({
            success:true,
            message: "Users update successfully",
            user:{
                id:user.id
            },
        });
    }
    } catch (error) {
        return res.status(500).json({ 
            message: "Error updating users", 
            error: error.message 
        });
   }
};
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; 
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
              success:false,
              message: "User not found",
            });
        }
          await user.destroy();
          return res.status(200).json({
            success:true,
            message: "User deleted successfully",
        });
    } catch (error) {
            return res.status(500).json({
              message: "Error deleting user",
              error: error.message,
            });
        }
};
const loginUser=async(req,res)=>{
    try{
        const {email,password,role}=req.body
        const user=await User.findOne({where:{email}})
        if (!user){
            return res.status(400).json({
              message: "Users not found!!"
            });
        }
        const isvalidUser = await bcrypt.compare(password,user.password)
        if (!isvalidUser){
            return res.status(400).json({
                message:"Invalid email or password!!"
            });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET || "your_fallback_secret", 
            { expiresIn: "7d" }
        );
        return res.status(200).json({
            success: true, 
            message: "User logged in successfully!",
            token,
            user: { 
                id: user.id,
                fullName: user.fullName, 
                role: user.role 
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
}; 

module.exports={
    getAllUsers, addUser, getUsersById, updateUser, deleteUser,loginUser
}