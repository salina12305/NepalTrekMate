const Booking = require('../models/bookingmodel');
const Package = require('../models/packagemodel');
const User = require('../models/usermodel');

exports.createBooking = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const customerId = req.user.id; // The logged-in traveler

        const booking = await Booking.findByPk(bookingId);
        
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // 3. Create the feedback
        const feedback = await Feedback.create({
            bookingId: parseInt(bookingId),
            rating: parseInt(rating),
            comment: comment,
            customerId: customerId, // Existing field
            userId: customerId,     // FIX: Added this to stop the "cannot be null" error
            guideId: booking.guideId || null, 
            agentId: booking.agentId || null
        });

        res.status(201).json({ success: true, data: feedback });
    } catch (error) {
        console.error("DETAILED DATABASE ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { packageId, bookingDate, guideId, numberOfPeople } = req.body;
        const userId = req.user.id;

        // 1. Fetch package to get the price
        const pkg = await Package.findByPk(packageId);
        if (!pkg) return res.status(404).json({ message: "Package not found" });
        const calculatedPrice = pkg.price * (numberOfPeople || 1);

        // 2. Create the booking
        const newBooking = await Booking.create({
            userId,
            packageId,
            guideId, // SAVING THE SELECTED GUIDE
            bookingDate,
            totalPrice: calculatedPrice,
            numberOfPeople: numberOfPeople || 1,
            status: 'pending'
        });
        res.status(201).json({
            success: true,
            message: "Booking initiated successfully!",
            booking: newBooking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [
                { model: Package },
                { 
                    model: User, 
                    as: 'guide', 
                    // ADD 'id' HERE explicitly
                    attributes: ['id', 'fullName', 'email', 'profileImage'] 
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// exports.getGuideAssignments = async (req, res) => {
//     try {
//         const guideId = req.user.id;
//         const assignments = await Booking.findAll({
//             where: { guideId: guideId },
//             include: [
//                 { model: Package },
//                 { 
//                     model: User, // This is the Traveler
//                     attributes: ['fullName', 'profileImage'] 
//                 }
//             ]
//         });
//         res.status(200).json({ success: true, assignments });
exports.getGuideAssignments = async (req, res) => {
    try {
        const guideId = req.user.id;
        const assignments = await Booking.findAll({
                        where: { guideId: guideId },
                        include: [
                            { model: Package },
                            { 
                                model: User, // This is the Traveler
                                attributes: ['fullName', 'profileImage'] 
                            }
                        ]
                    });
        res.status(200).json({ success: true, assignments }); // KEY: It sends 'assignments'
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Updated to handle ID from URL (req.params)
// exports.updateBookingStatus = async (req, res) => {
//     try {
//         const { id } = req.params; // Get ID from URL
//         const { status } = req.body; // Get status from Body
        
//         const booking = await Booking.findByPk(id);
//         if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

//         booking.status = status.toLowerCase(); 
//         await booking.save();

//         return res.status(200).json({ success: true, message: `Status updated to ${status}` });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

exports.updateBookingStatus = async (req, res) => {
    try {
        // 1. Get ID from the URL parameter (/:id)
        const { id } = req.params; 
        // 2. Get Status from the Request Body ({status: "..."})
        const { status } = req.body;

        const booking = await Booking.findByPk(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        booking.status = status;
        await booking.save();

        return res.status(200).json({ success: true, message: "Status updated" });
    } catch (error) {
        console.error("DB Error:", error.message);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: Package },
                { model: User, attributes: ['fullName', 'email'] }, // The Traveler
                { model: User, as: 'guide', attributes: ['fullName'] } // The Guide
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getSingleBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id, {
            include: [
                { model: Package },
                { model: User, attributes: ['fullName', 'email', 'profileImage'] }, // Traveler
                { model: User, as: 'guide', attributes: ['fullName'] } // Guide
            ]
        });

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.completeBooking = async (req, res) => {
    try {
        const { id } = req.params; // Booking ID
        const booking = await Booking.findByPk(id);

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Update status to COMPLETED
        booking.status = 'COMPLETED';
        await booking.save();

        res.status(200).json({ success: true, message: "Trip marked as completed!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.getGuideStats = async (req, res) => {
    try {
        const guideId = req.user.id; 

        // 1. Count finished trips
        const totalTrips = await Booking.count({
            where: { guideId: guideId, status: 'finished' }
        });

        // 2. Sum up earnings
        const totalEarnings = await Booking.sum('totalPrice', {
            where: { guideId: guideId, status: 'finished' }
        }) || 0;

        res.status(200).json({
            success: true,
            totalTrips,
            earnings: totalEarnings,
            averageRating: 4.8 // Placeholder
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

