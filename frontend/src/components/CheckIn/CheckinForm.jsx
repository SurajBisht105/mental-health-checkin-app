import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CheckinForm = () => {
  const [formData, setFormData] = useState({
    moodRating: 5,
    stressLevel: 'Medium',
    journalEntry: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await api.post('/checkin', formData);
      setSuccess(true);
      
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
      setError(error.response?.data?.error || 'Failed to save check-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Daily Check-in</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Check-in saved successfully! Redirecting to history...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              How are you feeling today? (1-10)
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">😢</span>
              <input               type="range"
              name="moodRating"
              min="1"
              max="10"
              value={formData.moodRating}
              onChange={handleChange}
              className="flex-1"
            />
              <span className="text-gray-600">😊</span>
              <span className="ml-2 font-semibold text-lg">{formData.moodRating}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Stress Level
            </label>
            <div className="space-y-2">
              {['Low', 'Medium', 'High'].map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="stressLevel"
                    value={level}
                    checked={formData.stressLevel === level}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className={`${
                    level === 'Low' ? 'text-green-600' : 
                    level === 'Medium' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              How are you feeling? (Journal Entry)
            </label>
            <textarea
              name="journalEntry"
              value={formData.journalEntry}
              onChange={handleChange}
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Write about your thoughts and feelings..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Check-in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckinForm;