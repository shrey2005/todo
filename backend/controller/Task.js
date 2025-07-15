const Task = require('../models/Task');
const dayjs = require('dayjs');
const { writeToStream } = require('@fast-csv/format');
const sendEmail = require('../utils/mailer');

exports.createTask = async (req, res) => {
    const { title, description, status, dueDate } = req.body;
    const file = req.file?.path;

    try {
        const task = new Task({
            userId: req.user.id,
            title,
            description,
            status,
            dueDate,
            file,
        });

        await task.save();

        await sendEmail({
            to: req.user.email,
            subject: 'Task Created Successfully',
            html: `Task Created with ${task.title}`,
        });

        res.status(201).json({
            message: 'Task created successfully',
        });
    } catch (error) {
        console.log('Error thrown from  create task : ', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });

        const filteredTasks = tasks.map((task) => {
            return {
                id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                dueDate: task.dueDate,
                file: task.file,
            };
        });

        res.status(200).json(filteredTasks);
    } catch (error) {
        console.log('Error during fetching tasks : ', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const update = { ...req.body };
        if (req.file) {
            update.file = req.file.path;
        }

        const { status, title } = req.body;

        const io = req.app.get('io');

        const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, update, { new: true });

        if (status && status === 'completed') {
            await sendEmail({
                to: req.user.email,
                subject: 'Task completed Successfully',
                html: `Task completed with ${title}`,
            });
        }
        
        if (!task) {
            return res.status(404).send('Task not found');
        }

        io.emit('taskStatusUpdated', { message: 'Task updated successfully', title: task.title, status: task.status });

        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        console.log('Error during updation task : ', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!task) {
            return res.status(404).send('Task not found');
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.log('Error during deletion task : ', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
};

exports.downloadTask = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=tasks.csv');

        const csvData = tasks.map((task) => ({
            'Task Id': task._id,
            Title: task.title,
            Status: task.status,
            'Created Date': dayjs(task.createdAt).format('YYYY-MM-DD'),
        }));

        const csvStream = writeToStream(res, csvData, {
            headers: ['Task Id', 'Title', 'Status', 'Created Date'],
            writeHeaders: true,
        });

        csvStream.on('error', (error) => {
            console.log('Error during csv generation : ', error);
            res.status(500).end();
        });

        csvStream.on('end', () => {
            res.end();
        });
    } catch (error) {
        console.log('Error during downloading task : ', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
};
