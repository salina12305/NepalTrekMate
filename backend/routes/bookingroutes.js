
// const router = require("express").Router();
// const bookingController = require('../controllers/bookingController');
// const authGuard = require("../helpers/authguard");

// // router.post('/create', authGuard, bookingController.createBooking);
// router.get('/my-bookings', authGuard, bookingController.getMyBookings);
// router.post('/update-status', authGuard, bookingController.updateBookingStatus);
// router.post('/add', bookingController.createBooking);
// router.get('/all', authGuard, bookingController.getAllBookings);
// router.get('/guide-assignments', authGuard, bookingController.getGuideAssignments);
// router.get("/get_single_booking/:id", authGuard, bookingController.getSingleBooking);
// router.post('/create', authGuard, bookingController.createBooking);
// module.exports = router;


// backend/routes/bookingRoutes.js
const router = require("express").Router();
const bookingController = require('../controllers/bookingController');
const authGuard = require("../helpers/authguard");

// Standardized Create Route
router.post('/create', authGuard, bookingController.createBooking);

// Other Booking Routes
router.get('/my-bookings', authGuard, bookingController.getMyBookings);
router.put('/update-status/:id', authGuard, bookingController.updateBookingStatus);
router.get('/all', authGuard, bookingController.getAllBookings);
router.get('/guide-assignments', authGuard, bookingController.getGuideAssignments);
router.get("/get_single_booking/:id", authGuard, bookingController.getSingleBooking);
router.put('/complete/:id', authGuard, bookingController.completeBooking);
module.exports = router;