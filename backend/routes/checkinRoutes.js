const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const checkinController = require('../controllers/checkinController');
const auth = require('../middleware/auth');

// Validation rules
const validateCheckin = [
  body('moodRating').isInt({ min: 1, max: 10 }),
  body('stressLevel').isIn(['Low', 'Medium', 'High']),
  body('journalEntry').trim().notEmpty().isLength({ max: 5000 })
];

// All routes require authentication
router.use(auth);

// Routes
router.post('/', validateCheckin, checkinController.createCheckin);
router.get('/', checkinController.getCheckins);
router.get('/:id', checkinController.getCheckinById);
router.delete('/:id', checkinController.deleteCheckin);

module.exports = router;