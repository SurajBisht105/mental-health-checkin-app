export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateMoodRating = (rating) => {
  return rating >= 1 && rating <= 10;
};

export const validateStressLevel = (level) => {
  return ['Low', 'Medium', 'High'].includes(level);
};

export const validateJournalEntry = (entry) => {
  return entry.trim().length > 0 && entry.length <= 5000;
};