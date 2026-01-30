
const router = require("express").Router();
const addpackageController = require('../controllers/addpackageController');
const authGuard = require("../helpers/authguard");
const upload = require("../middleware/upload");

router.get('/get_all', authGuard, addpackageController.getAllPackages); 
router.post('/add', authGuard, upload.single('packageImage'), addpackageController.addPackage);
router.get('/get-agent-packages/:agentId', authGuard, addpackageController.getAgentPackages);
router.get('/getPackageById/:uid', authGuard, addpackageController.getPackageById);
router.delete('/delete_packages/:id', authGuard, addpackageController.deletePackage);
router.put('/update_package/:id', authGuard, upload.single('packageImage'), addpackageController.updatePackage);

module.exports = router;