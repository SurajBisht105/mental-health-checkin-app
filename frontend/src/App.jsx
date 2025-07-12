import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Layout/Header';
import PrivateRoute from './components/Layout/PrivateRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CheckinForm from './components/CheckIn/CheckinForm';
import CheckinHistory from './components/CheckIn/CheckinHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkin" element={
                <PrivateRoute>
                  <CheckinForm />
                </PrivateRoute>
              } />
              <Route path="/history" element={
                <PrivateRoute>
                  <CheckinHistory />
                </PrivateRoute>
              } />
              <Route path="/" element={<Navigate to="/checkin" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;