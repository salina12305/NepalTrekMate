const router = require("express").Router();
const feedbackController = require('../controllers/feedbackController');
const authGuard = require("../helpers/authguard");

// router.delete('/delete/:id', authGuard, feedbackController.deleteFeedback);
router.post("/guide-add", authGuard, feedbackController.createGuideFeedback);

router.post("/add", authGuard, feedbackController.createFeedback);

// 2. Route for Guide-only feedback

// 3. Fetching for Agents
router.get("/agent/:agentId", authGuard, feedbackController.getAgentFeedback);
router.delete('/delete/:id', authGuard, feedbackController.deleteFeedback);
// 4. Fetching for Guides (The Dashboard calls this)
router.get("/my-reviews", authGuard, feedbackController.getGuideReviews);

module.exports = router;
