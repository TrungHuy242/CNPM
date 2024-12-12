const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import thư viện cors
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000',methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true, }));

// Routes
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', roomRoutes);
app.use('/api', bookingRoutes);
app.use('/api', userRoutes);
app.use('/api', notificationRoutes);
app.get('/', (req, res) => {
  app.use(express.urlencoded({ extended: true }));
    res.send('Welcome to the backend API');
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
