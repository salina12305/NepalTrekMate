
const Feedback = require('../models/feedbackmodel');
const Booking = require('../models/bookingmodel');
const Package = require('../models/packagemodel');
const User = require('../models/usermodel');

// FOR AGENTS (Package Feedback)
exports.createFeedback = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const booking = await Booking.findByPk(bookingId, {
            include: [{ model: Package }]
        });

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const feedback = await Feedback.create({
            bookingId,
            rating,
            comment,
            userId: req.user.id,        // Traveler ID
            agentId: booking.Package.agentId, 
            guideId: null               
        });
        
        res.status(201).json({ success: true, message: "Package feedback saved!" });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
};

// FOR GUIDES (Guide Feedback)
exports.createGuideFeedback = async (req, res) => {
    try {
        const { bookingId, rating, comment, guideId } = req.body;

        const feedback = await Feedback.create({
            bookingId,
            rating,
            comment,
            userId: req.user.id, // Traveler
            guideId: guideId,    
            agentId: null        
        });
        res.status(201).json({ success: true, message: "Guide feedback saved!" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAgentFeedback = async (req, res) => {
    try {
        const { agentId } = req.params;
        const feedbacks = await Feedback.findAll({
            where: { agentId: agentId, guideId: null },
            include: [
                {
                    model: Booking,
                    include: [
                        { model: Package, attributes: ['packageName'] },
                        { model: User, attributes: ['fullName', 'profileImage'] }
                    ]
                }
            ],
        });

        const formattedFeedbacks = feedbacks.map(f => ({
            id: f.id,
            rating: f.rating,
            comment: f.comment,
            packageName: f.Booking?.Package?.packageName,
            customerName: f.Booking?.User?.fullName,
            userPhoto: f.Booking?.User?.profileImage
        }));

        res.status(200).json({ success: true, feedbacks: formattedFeedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getGuideReviews = async (req, res) => {
    try {
        const guideId = req.user.id; 
        const feedbacks = await Feedback.findAll({
            where: { guideId: guideId, agentId: null },
            include: [
                { 
                    model: User,
                    as: 'customer', 
                    attributes: ['fullName', 'profileImage'] 
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, feedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByPk(id);
        if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });
        await feedback.destroy();
        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};