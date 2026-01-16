
const router= require("express").Router();
const upload = require('../middleware/upload'); 
const authGuard = require("../helpers/authGuard");
const isAdmin = require("../helpers/isAdmin");

const { 
    addUser, 
    getAllUsers,
    deleteUser, 
    getUsersById, 
    loginUser,
    uploadProfileImage
} = require('../controllers/userController');

const { 
    getPendingRequests, 
    approveUser, 
    rejectUser 
  } = require('../controllers/approveController');

router.post("/register", addUser);
router.post ("/login",loginUser);

router.get("/get_all_users", getAllUsers); 
router.get("/getUserByid/:uid", getUsersById);
router.delete("/delete_users/:id", deleteUser);

router.put('/approve-user/:id',authGuard, approveUser);
router.get('/pending-requests',authGuard, getPendingRequests);
router.delete('/reject-user/:id',authGuard,rejectUser);

router.post('/upload-profile', upload.single('profileImage'), uploadProfileImage);

module.exports=router;