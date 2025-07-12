const cron = require('node-cron');
const Task = require('./models/Task');
const sendEmail = require('./utils/mailer');

const checkDueTaskToday = async () => {

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setUTCHours(24, 0, 0, 0);

    const dueTasks = await Task.find({
        dueDate: {
            $gte: startOfToday,
            $lt: endOfToday
        }
    }).populate("userId")


    for (const task of dueTasks) {
        console.log(`Task "${task.title}" is due today for user ${task.userId}`);

        await sendEmail({
            to: task.userId.email,
            subject: `Reminder: Task "${task.title}" is due today`,
            html: `Don't forget to complete your task: ${task.title}`,
        });
    }
}

cron.schedule('* 8 * * *', async () => {
    try {
        console.log('Checking for tasks due today...');
        await checkDueTaskToday();
    } catch (error) {
        console.error('Error checking due tasks:', error);
    }
}, {
    scheduled: true,
    timezone: 'Asia/Kolkata'
});

module.exports = { checkDueTaskToday };
