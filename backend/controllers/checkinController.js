const Checkin = require('../models/Checkin');
const { encryptData, decryptData } = require('../utils/encryption');

const createCheckin = async (req, res) => {
  try {
    const { moodRating, stressLevel, journalEntry } = req.body;
    
    const encryptedJournal = encryptData(journalEntry);
    
    const checkin = new Checkin({
      userId: req.userId,
      moodRating,
      stressLevel,
      journalEntry: encryptedJournal
    });

    await checkin.save();
    res.status(201).json({ message: 'Check-in saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving check-in' });
  }
};

const getCheckins = async (req, res) => {
  try {
    const checkins = await Checkin.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(30);

    const decryptedCheckins = checkins.map(checkin => ({
      ...checkin.toObject(),
      journalEntry: decryptData(checkin.journalEntry)
    }));

    res.json(decryptedCheckins);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching check-ins' });
  }
};

module.exports = { createCheckin, getCheckins };