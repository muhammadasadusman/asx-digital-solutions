const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { requireAuth, requirePermission } = require('../middleware/auth');

router.get('/', portfolioController.getPortfolio);
router.get('/:id', portfolioController.getProjectById);
router.post('/', requireAuth, requirePermission('can_manage_portfolio'), portfolioController.createProject);
router.put('/:id', requireAuth, requirePermission('can_manage_portfolio'), portfolioController.updateProject);
router.delete('/:id', requireAuth, requirePermission('can_manage_portfolio'), portfolioController.deleteProject);

module.exports = router;
