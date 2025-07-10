const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        description: String,
        status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
        dueDate: Date,
        file: String,
    },
    { timestamps: true }
);

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
