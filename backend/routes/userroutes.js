
const router= require("express").Router();
const upload = require('../middleware/upload');
const packageroutes = require('./packageroutes');
const bookingController = require('../controllers/bookingController');
const authGuard = require("../helpers/authguard");
const isAdmin = require("../helpers/isAdmin");
const User = require("../models/usermodel");

const { 
    addUser, 
    getAllUsers,
    deleteUser, 
    getUsersById, 
    loginUser,
    uploadProfileImage,
    forgotPassword,
    resetPassword
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
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

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
router.get("/get_all_guides", async (req, res) => {
  try {
    const guides = await guides.find({}); 
    res.status(200).json({ success: true, guides });
  } catch (error) {
    res.status(500).json({ message: "Error fetching guides", error });
  }
});

router.get('/guide-stats', authGuard, bookingController.getGuideStats);
module.exports=router;