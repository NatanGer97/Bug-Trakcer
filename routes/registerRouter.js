const express = require('express');
const {validateUserInput} = require('../middlewares/InputValidationMiddelwares');
const {ActivationCodeValidation} = require('../middlewares/Validation/ActivationCodeValidation')

const router = express.Router();

const registerController = require('../controllers/RegisterController');


router.post('/',validateUserInput, registerController.handleNewUser);
router.post('/activate',  registerController.activateUser);
router.post('/resendCode/:userId', registerController.resendActivationCode);



module.exports = router;