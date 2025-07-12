const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const redisClient = require('../redisClient');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).send({ error: 'User not found' });
        }
        req.user = user;
       
        // const session = await redisClient.get(token);
        // if(!session) {
        //     return res.status(401).send({ error: 'Session expired' });
        // }
        // req.user = decoded; // Simulating user object, replace with actual user retrieval if needed
        next();
    } catch (error) {
        console.error('Authentication error:', error)   
        res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
