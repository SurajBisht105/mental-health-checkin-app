const Checkin = require('../models/Checkin');
const { validationResult } = require('express-validator');
const { encryptData, decryptData } = require('../utils/encryption');

exports.createCheckin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { moodRating, stressLevel, journalEntry } = req.body;

    // Encrypt sensitive data
    const encryptedJournalEntry = encryptData(journalEntry);

    // Create checkin
    const checkin = new Checkin({
      userId: req.userId,
      moodRating,
      stressLevel,
      journalEntry: encryptedJournalEntry
    });

    await checkin.save();

    res.status(201).json({
      message: 'Check-in saved successfully',
      checkin: {
        id: checkin._id,
        date: checkin.date,
        moodRating: checkin.moodRating,
        stressLevel: checkin.stressLevel
      }
    });
  } catch (error) {
    console.error('Checkin creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCheckins = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const checkins = await Checkin.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip(skip);

    // Decrypt journal entries
    const decryptedCheckins = checkins.map(checkin => ({
      id: checkin._id,
      date: checkin.date,
      moodRating: checkin.moodRating,
      stressLevel: checkin.stressLevel,
      journalEntry: decryptData(checkin.journalEntry),
      createdAt: checkin.createdAt
    }));

    const total = await Checkin.countDocuments({ userId: req.userId });

    res.json({
      checkins: decryptedCheckins,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCheckins: total
    });
  } catch (error) {
    console.error('Get checkins error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCheckinById = async (req, res) => {
  try {
    const checkin = await Checkin.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!checkin) {
      return res.status(404).json({ error: 'Check-in not found' });
    }

    res.json({
      id: checkin._id,
      date: checkin.date,
      moodRating: checkin.moodRating,
      stressLevel: checkin.stressLevel,
      journalEntry: decryptData(checkin.journalEntry),
      createdAt: checkin.createdAt
    });
  } catch (error) {
    console.error('Get checkin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCheckin = async (req, res) => {
  try {
    const checkin = await Checkin.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!checkin) {
      return res.status(404).json({ error: 'Check-in not found' });
    }

    res.json({ message: 'Check-in deleted successfully' });
  } catch (error) {
    console.error('Delete checkin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};