const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const morgan = require('morgan');
require('./config/passport'); // Passport config

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
// CORS Configuration
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.includes(origin) || !process.env.CLIENT_URL;
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.error('CORS blocked origin:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(morgan('dev'));

// Passport Middleware (will be configured later)
app.use(passport.initialize());

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/coding-rounds', require('./routes/codingRoundRoutes'));
app.use('/api/piston', require('./routes/executionRoutes'));

module.exports = app;
