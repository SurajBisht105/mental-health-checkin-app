import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';

const CheckinHistory = () => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedCheckin, setExpandedCheckin] = useState(null);

  useEffect(() => {
    fetchCheckins();
  }, [currentPage]);

  const fetchCheckins = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/checkins?page=${currentPage}&limit=10`);
      setCheckins(response.data.checkins);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load check-ins');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this check-in?')) {
      return;
    }

    try {
      await api.delete(`/checkins/${id}`);
      fetchCheckins();
    } catch (error) {
      alert('Failed to delete check-in');
    }
  };

  const getMoodEmoji = (rating) => {
    if (rating <= 2) return '😢';
    if (rating <= 4) return '😔';
    if (rating <= 6) return '😐';
    if (rating <= 8) return '🙂';
    return '😊';
  };

  const getStressColor = (level) => {
    switch (level) {
      case 'Low':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'High':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Check-in History</h2>

      {checkins.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No check-ins yet. Start by creating your first check-in!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {checkins.map((checkin) => (
            <div key={checkin.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-2xl">{getMoodEmoji(checkin.moodRating)}</span>
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(checkin.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm font-medium">
                          Mood: {checkin.moodRating}/10
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full ${getStressColor(checkin.stressLevel)}`}>
                          Stress: {checkin.stressLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {expandedCheckin === checkin.id ? (
                    <div className="mt-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{checkin.journalEntry}</p>
                      <button
                        onClick={() => setExpandedCheckin(null)}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                      >
                        Show less
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-gray-700 line-clamp-2">{checkin.journalEntry}</p>
                      <button
                        onClick={() => setExpandedCheckin(checkin.id)}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                      >
                        Read more
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(checkin.id)}
                  className="ml-4 text-red-600 hover:text-red-700"
                  title="Delete check-in"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckinHistory;