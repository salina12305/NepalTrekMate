const router = require("express").Router();
const wishlistController = require('../controllers/wishlistController');
const authGuard = require("../helpers/authguard");

router.post('/toggle', authGuard, wishlistController.toggleWishlist);
router.get('/my-wishlist', authGuard, wishlistController.getUserWishlist);

module.exports = router;