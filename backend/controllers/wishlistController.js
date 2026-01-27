const Wishlist = require('../models/wishlistmodel');
const Package = require('../models/packagemodel');

exports.toggleWishlist = async (req, res) => {
    try {
        const { packageId } = req.body;
        const userId = req.user.id; // From your authGuard

        const existing = await Wishlist.findOne({ where: { userId, packageId } });

        if (existing) {
            await existing.destroy();
            return res.status(200).json({ success: true, message: "Removed from wishlist", isWishlisted: false });
        } else {
            await Wishlist.create({ userId, packageId });
            return res.status(200).json({ success: true, message: "Added to wishlist", isWishlisted: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserWishlist = async (req, res) => {
    try {
        const wishlistItems = await Wishlist.findAll({
            where: { userId: req.user.id },
            include: [{ model: Package
             }] // Ensure associations are set in your DB sync file
        });
        res.status(200).json({ success: true, data: wishlistItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};