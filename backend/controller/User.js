const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const fs = require('fs');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const SESSION_TTL = 24 * 60 * 60;
const redisClient = require('../redisClient');

const REDIS_EXPIRATION = process.env.REDIS_EXPIRATION;
const JWT_SECRET = process.env.JWT_SECRET;

exports.Register = async (req, res) => {
    const { username, password, email } = req.body;
    const file = req.file?.path;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const newUser = new User({ username, password, email, file });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: { username } });
    } catch (error) {
        res.status(500).json({ error: error?.message || 'Failed to Register' });
    }
};

exports.Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const sessionId = uuidv4();

        const payload = { userId: user._id, sessionId: sessionId, email: user.email, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

        const sessionData = {
            userId: user._id,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };

        // Store session in Redis
        await redisClient.setEx(
            `session:${sessionId}`,
            parseInt(REDIS_EXPIRATION, 10),
            JSON.stringify(sessionData)
        );

        // Store session ID in user's sessions set
        await redisClient.sAdd(`user:${user.id}:sessions`, sessionId);
        await redisClient.expire(`session:${sessionId}`, SESSION_TTL);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,      
            sameSite: 'lax',   
            maxAge: 24 * 60 * 60 * 1000  // 1 day in milliseconds
        });

        res.status(200).json({ message: 'Login successful', token, sessionId, success: true, user: { username: user.username, email: user.email, file: user.file, id: user._id } });
    } catch (error) {
        console.log('Error during login:', error);
        res.status(500).json({ error: error?.message || 'Failed to login' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ username: user.username, email: user.email, file: user.file, id: user._id });
    } catch (error) {
        console.log('Error during fetching profile : ', error);
        res.status(500).json({ error: error?.message || 'Failed to fetched profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file?.path;

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ error: 'User mot found' });
        }

        if (user?.file && fs.existsSync(user.file)) {
            fs.unlinkSync(user.file);
        }
        const uploadDir = 'uploads/profile';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        await sharp(fs.readFileSync(file)).resize(200, 200).jpeg({ quality: 80 }).toFile(file);

        user.file = file;
        await user.save();

        res.status(200).json({ message: 'File Uploaded Successfully' });
    } catch (error) {
        console.log('Error from update profile wiht sharp : ', error);
        res.status(500).json({ error: error?.message || 'Failed to update profile image' });
    }
};

exports.logout = async (req, res) => {
    try {
        const sessionId = req.user.sessionId;
        if (sessionId) {
            await redisClient.del(`session:${sessionId}`);
            await redisClient.sRem(`user:${decoded.userId}:sessions`, sessionId);
        }

        res.clearCookie('token');
        res.status(200).json({ message: "Logged out" });
    }
    catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ error: 'Failed to logout' });
    }
}
