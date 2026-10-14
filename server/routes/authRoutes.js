const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, requirePermission } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getMe);

// User and RBAC management
router.get('/users', requireAuth, requirePermission('can_manage_users'), authController.getUsers);
router.post('/users', requireAuth, requirePermission('can_manage_users'), authController.createUser);
router.put('/users/:id/permissions', requireAuth, requirePermission('can_manage_users'), authController.updatePermissions);
router.delete('/users/:id', requireAuth, requirePermission('can_manage_users'), authController.deleteUser);

module.exports = router;
