const express = require('express');

const router = express.Router();

const refreshController = require('../controllers/RefreshTokenController');

// get rout for refresh token
router.get('/', refreshController.handleRefreshToken);

module.exports = router;