import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CheckinHistory = () => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    try {
      const response = await api.get('/checkin');
      setCheckins(response.data);
    } catch (error) {
      setError('Failed to load check-in history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (rating) => {
    if (rating <= 3) return '😢';
    if (rating <= 5) return '😐';
    if (rating <= 7) return '🙂';
    return '😊';
  };

  const getStressColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Check-in History</h2>
      
      {checkins.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No check-ins yet. Start by creating your first check-in!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {checkins.map((checkin) => (
            <div key={checkin._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">{formatDate(checkin.date)}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getMoodEmoji(checkin.moodRating)}</span>
                      <span className="font-semibold">Mood: {checkin.moodRating}/10</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`font-semibold ${getStressColor(checkin.stressLevel)}`}>
                        Stress: {checkin.stressLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-gray-700 whitespace-pre-wrap">{checkin.journalEntry}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckinHistory;