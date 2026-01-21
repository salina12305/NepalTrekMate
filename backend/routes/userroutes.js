
const router= require("express").Router();
const upload = require('../middleware/upload');
const packageroutes = require('./packageroutes');
const authGuard = require("../helpers/authguard");
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

const { 
  adminUpdateUser, 
  adminDeleteUser 
} = require('../controllers/adminController');

router.post("/register", addUser);
router.post ("/login",loginUser);

router.get("/get_all_users",authGuard, getAllUsers); 
router.get("/getUserByid/:uid", authGuard, getUsersById);
router.delete("/delete_users/:id",authGuard, isAdmin, deleteUser);
router.put("/admin/update-user/:id",authGuard,isAdmin,adminUpdateUser);
router.delete("/admin/delete-user/:id", adminDeleteUser);
router.put('/approve-user/:id',authGuard, approveUser);
router.get('/pending-requests',authGuard, getPendingRequests);
router.delete('/reject-user/:id',authGuard,rejectUser);

router.post('/upload-profile', upload.single('profileImage'), uploadProfileImage);

router.use('/packages', packageroutes);

module.exports=router;