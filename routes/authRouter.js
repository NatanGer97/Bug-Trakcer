const express = require('express');

const router = express.Router();

const authController = require('../controllers/AuthController');


router.post('/login', authController.handleLogin);

module.exports = router;