const router = require('express').Router();

router.get('/ping', (req, res) => {
    console.log('Health check success!!!');
    return res.send('Healthcheck pass');
});

module.exports = router;
