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

### Full-Stack Deployment on Render (Recommended)

Render.com is an excellent platform for deploying full-stack applications, handling both frontend and backend components seamlessly.

1. Create a `render.yaml` file in your project root with the following content:
   ```yaml
   services:
     # Backend API service
     - type: web
       name: charge-spot-finder-api
       env: node
       buildCommand: cd backend && npm install
       startCommand: cd backend && npm start
       envVars:
         - key: PORT
           value: 10000
         - key: NODE_ENV
           value: production
         - key: MONGODB_URI
           sync: false
         - key: JWT_SECRET
           sync: false

     # Frontend static site
     - type: web
       name: charge-spot-finder-frontend
       env: static
       buildCommand: cd frontend && npm install && npm run build
       staticPublishPath: ./frontend/dist
       routes:
         - type: rewrite
           source: /*
           destination: /index.html
       envVars:
         - key: VUE_APP_API_URL
           value: https://charge-spot-finder-api.onrender.com/api
         - key: VUE_APP_MAPBOX_TOKEN
           value: your_mapbox_token
   ```

2. Update your frontend's `.env.production` file:
   ```
   VUE_APP_API_URL=https://charge-spot-finder-api.onrender.com/api
   VUE_APP_MAPBOX_TOKEN=your_mapbox_token
   ```

3. Deploy to Render:
   - Push your code to GitHub
   - Sign up for Render.com and connect your GitHub account
   - Click "New" and select "Blueprint"
   - Select your repository
   - Render will automatically detect the `render.yaml` file and set up both services
   - Add your secret environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
   - Deploy both services

4. Your application will be available at:
   - Frontend: https://charge-spot-finder-frontend.onrender.com
   - Backend API: https://charge-spot-finder-api.onrender.com

### Alternative Deployment Options

#### CORS Configuration

Ensure your backend's CORS configuration allows requests from your Netlify frontend domain:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-netlify-app.netlify.app', 'https://your-custom-domain.com'] 
    : ['http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
```

#### Troubleshooting Deployment

- **CORS Issues**: If you see CORS errors in the browser console, update your backend CORS configuration to include your frontend domain
- **API Connection Issues**: Verify that your frontend's `.env.production` file has the correct API URL
- **Build Errors**: Check the build logs in Netlify or Vercel for specific error messages
- **Function Timeouts**: For long-running operations, optimize your API or increase timeout limits in Vercel
- **Database Connection**: Ensure your MongoDB connection string is correct and the IP is whitelisted

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
