const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = null;
        if (req.url.startsWith('/createtasks')) {
            dir = `uploads/${req.user.id}`;
        } else if (req.url.startsWith('/profile')) {
            dir = 'uploads/profile';
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
