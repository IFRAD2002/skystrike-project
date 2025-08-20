// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http'); // 1. Import http
const { Server } = require("socket.io"); // 2. Import Server from socket.io

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Import route files
const authRoutes = require('./routes/authRoutes');
const aircraftRoutes = require('./routes/aircraftRoutes');
const pilotRoutes = require('./routes/pilotRoutes');
const missionRoutes = require('./routes/missionRoutes');
const reportsRoutes = require('./routes/reportsRoutes');

const app = express();
const server = http.createServer(app); // 3. Create http server
const io = new Server(server, { // 4. Attach socket.io to the server
    cors: {
        origin: "*", // Allow all origins for simplicity
        methods: ["GET", "POST"]
    }
});

// Pass the io instance to be accessible in other files
app.set('socketio', io);

// Body parser middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/aircrafts', aircraftRoutes);
app.use('/api/pilots', pilotRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/reports', reportsRoutes);

// --- Socket.IO Connection Logic ---
let onlineUsers = []; // Maps userId to socketId

const addUser = (userId, socketId) => {
    !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    return onlineUsers.find(user => user.userId === userId);
};

io.on("connection", (socket) => {
    console.log("A user connected.");

    // Await user's ID
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        console.log('Online users:', onlineUsers);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected.");
        removeUser(socket.id);
    });
});
// --- End of Socket.IO Logic ---


const PORT = process.env.PORT || 5001;

// 5. Listen on the http server, not the app
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));