# GeoNest

<p align="center">
  <a href="https://reactjs.org/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="120" alt="React Logo" /></a>
</p>

## Description

GeoNest is a full-stack web application that provides an interactive platform for exploring and managing country information. The application features user authentication, country data exploration, and a favorites system.

## Technologies Used

### Frontend
- **React** - Frontend framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animation library
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client
- **JWT** - Authentication

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Token-based authentication
- **CORS** - Cross-origin resource sharing

### Testing
- **Jest** - Testing framework
- **Supertest** - HTTP testing

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes

### Country Exploration
- View all countries
- Search countries by name
- Filter by region
- View detailed country information
- Interactive maps using Leaflet

### User Features
- Dark/Light mode toggle
- Save favorite countries
- Responsive design

## Project Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-thimeshaA.git

# Navigate into the project folder
cd af-2-thimeshaA

# Install dependencies
npm install
```

## Running the Project

### Development Mode
```bash
# Start the frontend
npm start

# Start the backend server
npm run server
```

### Testing
```bash
# Run server tests
npm run test:server
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5001
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Countries
- `GET /api/countries` - Get all countries
- `GET /api/countries/:id` - Get country details
- `GET /api/countries/search?q=query` - Search countries

### Favorites
- `GET /api/favorites` - Get user's favorite countries
- `POST /api/favorites` - Add country to favorites
- `DELETE /api/favorites/:id` - Remove country from favorites

## Contributors
- [Thimesha Ansar](https://github.com/thimeshaA)

## Stay Connected
- Website: [ThimeshaAnsar.com](https://my-portfolio-chi-six-30.vercel.app)
- LinkedIn: [Thimesha Ansar](https://www.linkedin.com/in/thimeshaansar/)
