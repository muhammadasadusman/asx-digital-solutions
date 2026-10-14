const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { requireAuth, requirePermission } = require('../middleware/auth');

router.get('/', teamController.getTeam);
router.get('/:id', teamController.getTeamMember);

// Protected: Only Admin or staff with 'can_manage_team' permission
router.post('/', requireAuth, requirePermission('can_manage_team'), teamController.createTeamMember);
router.put('/:id', requireAuth, requirePermission('can_manage_team'), teamController.updateTeamMember);
router.delete('/:id', requireAuth, requirePermission('can_manage_team'), teamController.deleteTeamMember);

module.exports = router;
