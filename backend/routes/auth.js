const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRegistration, handleValidationErrors } = require('../middleware/validation');

router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateRegistration, handleValidationErrors, login);

module.exports = router;