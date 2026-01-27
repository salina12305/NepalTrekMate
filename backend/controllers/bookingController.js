const Booking = require('../models/bookingmodel');
const Package = require('../models/packagemodel');
const User = require('../models/usermodel');

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
                { model: User, as: 'guide', attributes: ['fullName', 'email', 'profileImage'] } // Include guide details
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.updateBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ 
            success: true, 
            message: `Booking has been ${status}!`,
            data: booking 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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

exports.getGuideAssignments = async (req, res) => {
    try {
        const guideId = req.user.id; // Identification from Auth Token

        const assignments = await Booking.findAll({
            where: { 
                guideId: guideId,      // Task must be assigned to THIS guide
                status: 'confirmed'    // CRITICAL: Agent must have approved it
            },
            include: [
                { 
                    model: Package, 
                    attributes: ['packageName', 'destination', 'packageImage'] 
                },
                { 
                    model: User, // This is the Traveler (User who booked)
                    attributes: ['fullName', 'email', 'profileImage'] 
                }
            ],
            order: [['bookingDate', 'ASC']]
        });

        res.status(200).json({ success: true, data: assignments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};