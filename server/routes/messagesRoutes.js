const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { requireAuth, requirePermission } = require('../middleware/auth');

// Public contact inquiry submission
router.post('/', messagesController.submitMessage);

// Admin / Support manager inbox
router.get('/', requireAuth, requirePermission('can_manage_messages'), messagesController.getMessages);
router.put('/:id', requireAuth, requirePermission('can_manage_messages'), messagesController.updateMessageStatus);
router.delete('/:id', requireAuth, requirePermission('can_manage_messages'), messagesController.deleteMessage);

module.exports = router;
