# EV Charging Station Management System

A full-stack application for managing EV charging stations with user authentication, CRUD operations, and map visualization.

## Features

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: Vue.js 3
- **Authentication**: JWT-based user authentication
- **CRUD Operations**: Create, Read, Update, Delete charging stations
- **Map Integration**: Visualize charging stations on a map using Mapbox
- **Filtering**: Filter charging stations by status, power output, and connector type
- **Responsive Design**: Mobile-friendly UI using Bootstrap 5

## Project Structure

```
/
├── backend/         # Node.js & Express API
│   ├── src/         # Source code
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   └── server.js    # Entry point
│   ├── .env         # Environment variables
│   └── package.json  # Dependencies
│
├── frontend/        # Vue.js frontend application
│   ├── public/      # Static assets
│   ├── src/         # Source code
│   │   ├── assets/      # Images, fonts, etc.
│   │   ├── components/  # Reusable Vue components
│   │   ├── router/      # Vue Router configuration
│   │   ├── services/    # API services
│   │   ├── store/       # Vuex state management
│   │   ├── views/       # Page components
│   │   ├── App.vue      # Root component
│   │   └── main.js      # Entry point
│   ├── .env         # Environment variables
│   └── package.json  # Dependencies
│
├── netlify.toml     # Netlify deployment configuration
└── README.md        # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas)
- Mapbox account for map integration

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ev-charging-db
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Start the server:
   ```
   npm start
   ```
   For development with auto-reload:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VUE_APP_API_URL=http://localhost:5000/api
   VUE_APP_MAPBOX_TOKEN=your_mapbox_token
   ```

4. Start the development server:
   ```
   npm run serve
   ```

5. Build for production:
   ```
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get user profile (protected)

### Charging Stations
- `GET /api/stations` - Get all charging stations
  - Query parameters: `status`, `connectorType`, `minPower`, `maxPower`
- `GET /api/stations/:id` - Get a specific charging station
- `POST /api/stations` - Create a new charging station (protected)
- `PUT /api/stations/:id` - Update a charging station (protected)
- `DELETE /api/stations/:id` - Delete a charging station (protected)

### Testing
- `GET /api/test` - Get API status and system information
- `GET /api/test/ping` - Simple ping-pong response for connectivity testing
- `GET /` - Welcome message (root endpoint)

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables from your `.env` file
5. Deploy the service

### Frontend Deployment (Netlify)

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Configure the build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables from your `.env` file
5. Deploy the site

### Full-Stack Deployment (Vercel)

1. Install Vercel CLI (optional for local testing):
   ```
   npm install -g vercel
   ```

2. Make sure you have the `vercel.json` configuration file in your project root with the following content:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/src/server.js",
         "use": "@vercel/node"
       },
       {
         "src": "frontend/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "backend/src/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "frontend/dist/$1"
       }
     ]
   }
   ```

3. Update your frontend's `.env` file to point to the Vercel deployment URL:
   ```
   VUE_APP_API_URL=https://your-vercel-app-name.vercel.app/api
   ```

4. Deploy to Vercel:
   - Push your code to GitHub
   - Import your repository in the Vercel dashboard
   - Configure environment variables (including MongoDB connection string and JWT secret)
   - Deploy

5. Troubleshooting Vercel Deployment:
   - Ensure your server.js is properly handling CORS for the Vercel domain
   - Check that your API routes match the patterns defined in vercel.json
   - Verify that all dependencies are correctly listed in package.json
   - For function timeout errors, optimize your API response times or increase timeout limits
   - For payload size errors, reduce the size of your request/response data

### MongoDB Deployment

1. Create a MongoDB Atlas account
2. Set up a new cluster
3. Create a database user
4. Get your connection string
5. Update the `MONGODB_URI` in your backend environment variables

## Testing the Application

### Backend API Testing

You can test the API endpoints using tools like Postman or curl:

```bash
# Test API connectivity
curl http://localhost:5000/api/test/ping

# Get API status and information
curl http://localhost:5000/api/test

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## License

MIT
