const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { requireAuth, requirePermission } = require('../middleware/auth');

// Public endpoints
router.get('/', reviewsController.getReviews);
router.post('/', reviewsController.createReview);

// Admin / Moderator endpoints
router.get('/all', requireAuth, requirePermission('can_manage_reviews'), reviewsController.getAllReviewsAdmin);
router.put('/:id', requireAuth, requirePermission('can_manage_reviews'), reviewsController.updateReviewStatus);
router.delete('/:id', requireAuth, requirePermission('can_manage_reviews'), reviewsController.deleteReview);

module.exports = router;
