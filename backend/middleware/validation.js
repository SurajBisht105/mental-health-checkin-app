const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validateCheckin = [
  body('moodRating').isInt({ min: 1, max: 10 }),
  body('stressLevel').isIn(['Low', 'Medium', 'High']),
  body('journalEntry').notEmpty().trim()
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateCheckin,
  handleValidationErrors
};