
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env var
dotenv.config();


connectDB();
const authRoutes = require('./routes/authRoutes');
const aircraftRoutes = require('./routes/aircraftRoutes');
const pilotRoutes = require('./routes/pilotRoutes');
const missionRoutes = require('./routes/missionRoutes');
const reportsRoutes = require('./routes/reportsRoutes');

const app = express();

// Body parser middleware
app.use(express.json());


app.use(cors());

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Skystrike API is running...');
});
// Set static folder(for photos and stuff)
app.use(express.static('public'));

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/aircrafts', aircraftRoutes);
app.use('/api/pilots', pilotRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/reports', reportsRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));