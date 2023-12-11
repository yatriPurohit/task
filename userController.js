const { hash, compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const multer = require('multer');
const { memoryStorage } = require('multer');
const User = require('../models/userModel');

const storage = memoryStorage();
const upload = multer({ storage: storage });

class UserController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Check if the user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }


            const hashedPassword = await hash(password, 10);

            // Create a new user
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
            });

            // Save the user to the database
            await newUser.save();

            // Optionally, you can generate a JWT token for the registered user
            const token = sign({ userId: newUser._id }, 'your-secret-key');

            // Respond with success and the generated token
            res.status(201).json({ message: 'User registered successfully', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find the user by email
            const user = await User.findOne({ email });

            // Check if the user exists
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Compare the provided password with the hashed password in the database
            const passwordMatch = await compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Optionally, you can generate a JWT token for the logged-in user
            const token = sign({ userId: user._id }, 'your-secret-key');

            // Respond with success and the generated token
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    async fetchUserData(req, res) {
        try {
            // Fetch user data based on the authenticated user (assuming you have authentication middleware)
            const userId = req.user.id; // Adjust this based on your authentication mechanism
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Respond with user data
            res.status(200).json({ user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new UserController();
