const jwt = require('jsonwebtoken');
const redisClient = require('../redisClient');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || null
        if (!token) {
            return res.status(401).send({ valid: false, error: 'Authentication required: Token missing' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const { sessionId, userId } = decoded;
        if (!sessionId || !userId) {
            return res.status(401).send({ valid: false, message: 'Invalid session' });
        }

        const sessionData = await redisClient.get(`session:${sessionId}`);
        if (!sessionData) {
            return res.status(401).send({ valid: false, message: 'Session expired' });
        }

        const session = JSON.parse(sessionData);
        session.lastActivity = new Date().toISOString();

        await redisClient.setEx(`session:${sessionId}`, parseInt(process.env.REDIS_EXPIRATION, 10), JSON.stringify(session));
        req.user = {
            id: userId,
            email: session.email,
            role: session.role,
            sessionId: sessionId,
        }

        req.session = session;

        next();
    } catch (error) {
        console.error('Authentication error:', error)
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                valid: false,
                message: 'Token expired'
            });
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).json({
                valid: false,
                message: 'Invalid token'
            });
        } else {
            res.status(401).json({
                valid: false,
                message: 'Authentication failed'
            });
        }
    }
};

module.exports = authMiddleware;
