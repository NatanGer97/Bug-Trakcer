const express = require('express');

const router = express.Router();

const teamController = require('../controllers/TeamController');


router.post('/create-team', teamController.createTeam);

module.exports = router;