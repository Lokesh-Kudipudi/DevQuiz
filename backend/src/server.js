require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_round', (roundId) => {
        socket.join('round_' + roundId);
        console.log(`Client ${socket.id} joined round ${roundId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible globally or pass it to routes
app.set('socketio', io);

const PORT = process.env.PORT || 5174;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
