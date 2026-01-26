const User =require("../models/usermodel")
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

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            fullName: fullName, 
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({ 
            message: "User added successfully", 
            // user: newUser.id });
            user: { id: newUser.id, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error adding user",
            error: error.message
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
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.json({
            user: { id: user.id, name: user.username, email: user.email },
            message: "User fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error retrieving user", 
            error: error.message });
    }
};


const getActiveUsers = async (req, res) =>{
    res.json({message:"this is the getUser request"});
};
const deleteUser  = async (req, res) =>{
    try {
        const id = req.params.uid
        const users = await User.findByPk(id)
        return res.json({
            user: {id:users.id, name:users.username},
            message: "Users deleted successfully",
            
        })
    } catch (error) {
        return res.status(500).json({ 
            message: "Error retrieving users", 
            error: error.message 
        });
   }
};

const updateUser  = async (req, res) =>{
    try {
        const {id} = req.params;
        const {username, email, password}= req.body;
        const users = await User.findByPk(id);
        if (!users){
            return res.status(404).json({
                message:"User not found",
            });
        }
        if (username){
            const isexistinguser=await User.findOne({where:{username}})
            if (isexistinguser && isexistinguser.id !==users.id){
                return res.status(400).json({
                    message: "user with that username exist!",
                })

            }
        
        let hashedPassword= users.password;
        if(password){
            hashedPassword= await bcrypt.hash(password,10);
        }
        await users.update({
            username: username || users.username,
            email: email || users.email,
            password: hashedPassword,
                });
        return res.status(200).json({
        // res.status(200).json({
            
            message: "Users update successfully",
            users,
        });
    }
    } catch (error) {
        return res.status(500).json({ 
       
            message: "Error updating users", 
            error: error.message 
        });
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
        if (user.role !== role ){
            return res.status(403).json({
               message: `Unauthorized. You are registered as a ${user.role}, not an ${role}.`
           }) 
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
            })
        }
        const token = jwt.sign(
            {id:user.id, role:user.role, email:user.email},
            process.env.JWT_SECRET || "your_fallback_secret",
            { expiresIn: "7d"}
        );
        return res.status(200).json({
            success:true,
            message:"user logged in successfully!",
            token,
            user:{
                id: user.id,
                fullName: user.fullName,
                role: user.role
            }
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({success:false, error:error.message});
    }
};

module.exports={
    getAllUsers, getActiveUsers, addUser, getUsersById, updateUser, deleteUser, loginUser

}

