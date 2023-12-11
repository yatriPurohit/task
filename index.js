const express = require('express');
const mongoose = require('mongoose');
const path = require('path');  // Import the 'path' module
const UserController = require('./controllers/userController');
const multer = require('multer');
const app = express();
const PORT = 3002;

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Use express.static to serve static HTML files from the same directory
app.use(express.static(__dirname));

app.post('/register', upload.single('image'), UserController.register);
app.post('/login', UserController.login);
app.get('/api/user/:userId', UserController.fetchUserData);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
