const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redisClient = require('../redisClient');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    try {
        // Try to get token from Authorization header or cookies
        const token = req.cookies.token || null

        if (!token) {
            return res.status(401).send({ error: 'Authentication required: Token missing' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        // const user = await User.findById(decoded.userId);
        // if (!user) {
        //     return res.status(401).send({ error: 'User not found' });
        // }
        // req.user = user;

        const { sessionId, userId } = decoded;
        if (!sessionId || !userId) {
            return res.status(401).send({ message: 'Invalid session' });
        }

        console.log('Session ID:', sessionId);
        const sessionData = await redisClient.get(`session:${sessionId}`);
        console.log('Session data from Redis:', sessionData);
        // If session data is not found or expired, return unauthorized
        if (!sessionData) {
            return res.status(401).send({ message: 'Session expired' });
        }

        const session = JSON.parse(sessionData);
        session.lastActivity = new Date().toISOString();

        // Update session in Redis with new last activity time
        await redisClient.setEx(`session:${sessionId}`,  parseInt(process.env.REDIS_EXPIRATION, 10), JSON.stringify(session));
        console.log('Updated session in Redis:', session);
        req.user = {
            id: userId,
            email: session.email,
            role: session.role,
            sessionId: sessionId,
        }

        // req.user = decoded; // Simulating user object, replace with actual user retrieval if needed
        next();
    } catch (error) {
        console.error('Authentication error:', error)
        res.status(401).send({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
