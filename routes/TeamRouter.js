const express = require('express');

const router = express.Router();

const teamController = require('../controllers/TeamController');

// TODO: add validation middleware
router.post('/create-team', teamController.createTeam);
router.delete('/delete-team/:teamId', teamController.deleteTeam);

module.exports = router;