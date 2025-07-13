const express = require('express');
const router = express.Router();
const { createCheckin, getCheckins } = require('../controllers/checkinController');
const auth = require('../middleware/auth');
const { validateCheckin, handleValidationErrors } = require('../middleware/validation');

router.post('/', auth, validateCheckin, handleValidationErrors, createCheckin);
router.get('/', auth, getCheckins);

module.exports = router;