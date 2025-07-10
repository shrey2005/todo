const router = require('express').Router();
const TaskController = require('../../controller/Task');

const upload = require('../../middleware/upload');
const auth = require('../../middleware/auth');

router.get('/gettasks',auth, TaskController.getTasks);
router.post('/createtasks', auth, upload.single('file'), TaskController.createTask);
router.put('/updatetasks/:id', auth, upload.single('file'), TaskController.updateTask);
router.get('/downloadtask', auth, TaskController.downloadTask);
router.delete('/deletetasks/:id',auth, TaskController.deleteTask);

module.exports = router;
