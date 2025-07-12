import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CheckinForm = () => {
  const [formData, setFormData] = useState({
    moodRating: 5,
    stressLevel: 'Medium',
    journalEntry: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.journalEntry.trim()) {
      newErrors.journalEntry = 'Please write something about how you\'re feeling';
    } else if (formData.journalEntry.length > 5000) {
      newErrors.journalEntry = 'Journal entry is too long (max 5000 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await api.post('/checkins', formData);
      setSuccessMessage('Check-in saved successfully!');
      
      // Reset form
      setFormData({
        moodRating: 5,
        stressLevel: 'Medium',
        journalEntry: ''
      });
      
      // Redirect to history after 2 seconds
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (error) {
      setErrors({ submit: error.response?.data?.error || 'Failed to save check-in' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Daily Check-in</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
          
          {/* Mood Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling today? (1-10)
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">😢</span>
              <input
                type="range"
                name="moodRating"
                min="1"
                max="10"
                value={formData.moodRating}
                onChange={handleChange}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">😊</span>
              <span className="ml-4 text-lg font-semibold text-blue-600">
                {formData.moodRating}
              </span>
            </div>
          </div>
          
          {/* Stress Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current stress level
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['Low', 'Medium', 'High'].map((level) => (
                <label
                  key={level}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.stressLevel === level
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="stressLevel"
                    value={level}
                    checked={formData.stressLevel === level}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>
          
          {/* Journal Entry */}
          <div>
            <label htmlFor="journalEntry" className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling? What's on your mind?
            </label>
            <textarea
              id="journalEntry"
              name="journalEntry"
              rows="6"
              value={formData.journalEntry}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.journalEntry ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Take a moment to reflect on your day..."
            />
            {errors.journalEntry && (
              <p className="mt-1 text-sm text-red-600">{errors.journalEntry}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.journalEntry.length}/5000 characters
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Saving...' : 'Save Check-in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckinForm;