const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const { requireAuth, requirePermission } = require('../middleware/auth');

router.get('/', servicesController.getServices);
router.post('/', requireAuth, requirePermission('can_manage_services'), servicesController.createService);
router.put('/:id', requireAuth, requirePermission('can_manage_services'), servicesController.updateService);
router.delete('/:id', requireAuth, requirePermission('can_manage_services'), servicesController.deleteService);

module.exports = router;
