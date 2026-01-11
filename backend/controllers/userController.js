
const User =require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const addUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in use" });
        }

        if (role === "admin") {
            const existingAdmin = await User.findOne({ where: { role: "admin" } });
            if (existingAdmin) {
                return res.status(400).json({
                    message: "Admin account already exists. Only one admin is allowed."
                });
            }
        }
        const initialStatus = (role === 'travelagent') 
            ? 'pending' 
            : 'approved';

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        
        const newUser = await User.create({
            fullName: fullName, 
            email,
            password: hashedPassword,
            role,
            status: initialStatus
        });

        res.status(201).json({ 
            success: true,
            id: newUser.id,
            message: "User registered! Now upload your photo."
        });
        const successMessage = (initialStatus === 'pending')
            ? "Registration submitted. Please wait for Admin approval."
            : "User registered successfully!";

            res.status(201).json({
                success: true,
                message: successMessage,
                user: {
                    id: newUser.id,
                    role: newUser.role,
                    status: newUser.status 
                }
            });
    } catch (error) {
        console.error("Error in addUser:", error);
        res.status(500).json({ 
            message: "Error adding user"
         });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } });
        res.status(200).json({ 
            message: "Users retrieved successfully", users 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error retrieving users", error: error.message 
        });
    }
};

const getUsersById = async (req, res) => {
    try {
        const id = req.params.uid;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ 
            message: "User not found" 
        });

        return res.json({
             id: user.id, 
             fullName: user.username, 
             email: user.email,
            message: "User fetched successfully",
            profileImage: user.profileImage 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error retrieving user", 
            error: error.message 
        });
    }
};

const deleteUser  = async (req, res) =>{
    try {
        const {id} = req.params;
        const deletedCount = await User.destroy({
            where: { id: id }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "Users deleted successfully"   
        });
    } catch (error) {
         res.status(500).json({ 
            message: "Error deleting users",
            error: error.message 
        });
   }
};

const updateUser  = async (req, res) =>{
    try {
        const {id} = req.params;
        const {fullName, email, password}= req.body;
        const user = await User.findByPk(id);
        if (!user){
            return res.status(404).json({
                message:"User not found",
            });
        }
        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        await user.update({
            fullName: fullName || user.fullName,
            email: email || user.email,
            password: hashedPassword,
        });
        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error updating user", error: error.message });
    }
}; 

const loginUser=async(req,res)=>{
    try{
        const {email,password,role}=req.body
        const user=await User.findOne({where:{email}})
        if (!user){
            return res.status(400).json({
            message: "Users not found!!"}) 
        }

        if (user.role !== role) {
            return res.status(403).json({ 
                message: `Unauthorized. You are registered as a ${user.role}, not an ${role}.` 
            });
        }

        if ((user.role === 'travelagent') && user.status === 'pending') {
            return res.status(403).json({ 
                success: false,
                message: "Your account is pending admin approval. Please wait for verification." 
            });
        }

        const isvalidUser = await bcrypt.compare(password,user.password)
        if (!isvalidUser){
            return res.status(400).json({
                message:"Invalid email or password!!"
            });
        }
        const token = jwt.sign(
            {id:user.id, role:user.role, email:user.email},
            process.env.JWT_SECRET  || "your_fallback_secret",
            { expiresIn: "7d"}
        );
        return res.status(200).json({
            success: true,
            message:"User logged in successfully!",
            token,
            user: { 
                id: user.id,
                fullName: user.fullName, 
                role: user.role 
            }
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false, error:error.message
        });
    }
};

module.exports={
    getAllUsers, 
    addUser, 
    getUsersById, 
    updateUser, 
    deleteUser, 
    loginUser

}

