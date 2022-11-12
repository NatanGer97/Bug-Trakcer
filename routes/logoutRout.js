const express = require('express');

const router = express.Router();

const LogoutController = require('../controllers/LogoutController');

// get rout for refresh token
router.get('/', LogoutController.handleLogout);

module.exports = router;