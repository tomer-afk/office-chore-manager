const express = require('express');
const router = express.Router();
const choresController = require('../controllers/chores.controller');
const { authenticateToken } = require('../middleware/auth');

// All chore routes require authentication
router.use(authenticateToken);

// Team chores routes
router.get('/teams/:teamId/chores', choresController.getChores);
router.post('/teams/:teamId/chores', choresController.createChore);
router.get('/teams/:teamId/calendar', choresController.getCalendarData);

// Individual chore routes
router.get('/chores/:id', choresController.getChore);
router.put('/chores/:id', choresController.updateChore);
router.delete('/chores/:id', choresController.deleteChore);
router.post('/chores/:id/complete', choresController.completeChore);
router.get('/chores/:id/history', choresController.getChoreHistory);

module.exports = router;
