const router = require('express').Router();

const authRoute = require('./authRoute');
const taskRoute = require('./taskRoute');

router.use('/auth', authRoute);
router.use('/task', taskRoute);

router.get('/ping', (req, res) => {
    return res.json({
        message: 'pong',
    });
});

module.exports = router;
