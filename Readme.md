# Mental Health Check-in Web Application

A secure, full-stack web application for daily mental health check-ins with encrypted journal entries.

## Features

- User authentication (JWT-based)
- Daily mental health check-ins with mood rating, stress level, and journal entries
- Encrypted journal entries using AES encryption
- Check-in history view
- Responsive design with Tailwind CSS
- Secure API with rate limiting and input validation

## Tech Stack

- **Frontend**: React, Tailwind CSS, React Router
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT, bcrypt
- **Security**: Helmet, CORS, rate limiting, AES encryption

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd mental-health-checkin