const Task = require('../models/Task');
const sendEmail = require('../utils/mailer');
const Papa = require('papaparse');

exports.createTask = async (req, res) => {
    const { title, description, status, dueDate } = req.body;
    const file = req.file?.path;

    try {
        const task = new Task({
            userId: req.user._id,
            title,
            description,
            status,
            dueDate,
            file,
        });

        await task.save();

        await sendEmail({
            to: 'jhon.doe@yopmail.com',
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
        const tasks = await Task.find({ userId: req.user._id });

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
        if (status && status === 'completed') {
            await sendEmail({
                to: 'jhon.doe@yopmail.com',
                subject: 'Task completed Successfully',
                html: `Task completed with ${title}`,
            });
        }

        const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, update, { new: true });

        if (!task) {
            return res.status(404).send('Task not found');
        }

        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        console.log('Error during updation task : ', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!task) {
            return res.status(404).send('Task not found');
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
};

exports.downloadTask = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });

        const csvData = Papa.unparse(tasks.map(task => ({
            id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate,
            file: task.file,
        })));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=tasks.csv');
        // res.attchement('tasks-report.csv');
        res.status(200).send(csvData);
    } catch (error) {
        console.log('Error during downloading task : ', error);
        res.status(500).json({ error: error?.message || 'Internal server error' });
    }
}