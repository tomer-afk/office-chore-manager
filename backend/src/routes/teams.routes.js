const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teams.controller');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Team routes
router.get('/', teamsController.getUserTeams);
router.post('/', teamsController.createTeam);
router.get('/:id', teamsController.getTeam);
router.put('/:id', teamsController.updateTeam);
router.delete('/:id', teamsController.deleteTeam);

// Team member routes
router.get('/:id/members', teamsController.getTeamMembers);
router.post('/:id/members', teamsController.addTeamMemberByEmail);
router.delete('/:id/members/:userId', teamsController.removeTeamMember);

module.exports = router;
