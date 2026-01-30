const router = require("express").Router();
const feedbackController = require('../controllers/feedbackController');
const authGuard = require("../helpers/authguard");

router.post("/guide-add", authGuard, feedbackController.createGuideFeedback);
router.post("/add", authGuard, feedbackController.createFeedback);
router.get("/agent/:agentId", authGuard, feedbackController.getAgentFeedback);
router.delete('/delete/:id', authGuard, feedbackController.deleteFeedback);
router.get("/my-reviews", authGuard, feedbackController.getGuideReviews);

module.exports = router;
