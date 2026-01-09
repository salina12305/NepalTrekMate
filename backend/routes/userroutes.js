
const router= require("express").Router();

const { 
    addUser, 
    getAllUsers,
    deleteUser, 
    getUsersById, 
    loginUser
} = require('../controllers/userController');


router.post("/register", addUser);
router.get("/get_all_users", getAllUsers); 
router.get("/getUserByid/:uid", getUsersById);
router.delete("/delete_users/:id", deleteUser);
router.post ("/login",loginUser);


module.exports=router;