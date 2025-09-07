
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http'); 
const { Server } = require("socket.io"); 
const notificationRoutes = require('./routes/notificationRoutes');


dotenv.config();


connectDB();

// Import route files
const authRoutes = require('./routes/authRoutes');
const aircraftRoutes = require('./routes/aircraftRoutes');
const pilotRoutes = require('./routes/pilotRoutes');
const missionRoutes = require('./routes/missionRoutes');
const reportsRoutes = require('./routes/reportsRoutes');

const app = express();
const server = http.createServer(app); 
const io = new Server(server, { 
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});


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
app.use('/api/notifications', notificationRoutes);


let onlineUsers = []; 

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

    
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        console.log('Online users:', onlineUsers);
    });

    
    socket.on("disconnect", () => {
        console.log("A user disconnected.");
        removeUser(socket.id);
    });
});



const PORT = process.env.PORT || 5001;


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));