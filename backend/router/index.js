const router = require('express').Router();
const baseRoute = require('./api/index');

router.use('/api/v1', baseRoute);

module.exports = router;
