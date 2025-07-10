const router = require('express').Router();
const UserController = require('../../controller/User');
const upload = require('../../middleware/upload');
const auth = require('../../middleware/auth');

router.post('/register', upload.single('file'), UserController.Register);
router.post('/login', UserController.Login);
router.get('/profile', auth, UserController.getProfile);
router.put('/profile/:id', auth, upload.single('file'), UserController.updateProfile);

module.exports = router;
