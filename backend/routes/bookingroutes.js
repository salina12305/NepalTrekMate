const router = require("express").Router();
const bookingController = require('../controllers/bookingController');
const authGuard = require("../helpers/authguard");

// This path must match what the frontend calls
router.post('/create', authGuard, bookingController.createBooking);
router.get('/my-bookings', authGuard, bookingController.getMyBookings);
router.put('/update-status', authGuard, bookingController.updateBookingStatus);
router.get('/all', authGuard, bookingController.getAllBookings);
router.get('/guide-assignments', authGuard, bookingController.getGuideAssignments);

module.exports = router;