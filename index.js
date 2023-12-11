// index.js
const express = require('express');
const mongoose = require('mongoose');
const UserController = require('./controllers/userController');
const multer = require('multer');
const app = express();
const PORT = 3002;

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.json());

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve HTML pages
app.use(express.static(__dirname));

// Registration endpoint
app.post('/register', upload.single('image'), UserController.register);

// Login endpoint
app.post('/login', UserController.login);

// Profile page route
app.get('/profile', UserController.getProfilePage);

// Login page route
app.get('/', UserController.getLoginPage);

// API endpoint to fetch user data
app.get('/api/user/:userId', UserController.fetchUserData);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
