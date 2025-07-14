import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Edit, Trash, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTask } from '../store/useTask';
import socket from '../socket';

const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string(),
    status: yup.string().required(),
    dueDate: yup.date().nullable(),
    file: yup.mixed(),
});

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function TaskDashboard() {
    const {  createTask, getTask, deleteTask, updateTask, task, downloadTask } = useTask();

    useEffect(() => {
        const handleTaskStatusUpdated = (updatedTask) => {
            toast.success(`Task "${updatedTask.title}" status changed to ${updatedTask.status}`);
        };
        socket.on('taskStatusUpdated', handleTaskStatusUpdated);
        getTask();
        return () => socket.off('taskStatusUpdated', handleTaskStatusUpdated);
    }, []);

    const [editingIndex, setEditingIndex] = useState(null);
    const [file, setFile] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [editFile, setEditFile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);    

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const PreviewImage = () => {
        return (
            <div>
                {!file && (
                    <input
                        type="file"
                        className="w-full rounded-lg border px-3 py-2"
                        onChange={(e) => {
                            setFile(e.target.files);
                            if (e.target.files && e.target.files[0]) {
                                const reader = new FileReader();
                                reader.onload = (ev) => setPreviewFile(ev.target.result);
                                reader.readAsDataURL(e.target.files[0]);
                            }
                        }}
                    />
                )}
                {file && file.length > 0 && <div className="mt-2 text-sm text-gray-600">Selected file: {file[0].name}</div>}
                {previewFile && <img src={previewFile} alt="Preview" className="mt-2 h-24 rounded border" />}
            </div>
        );
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (key !== 'file') {
                    formData.append(key, value);
                }
            });

            if (editingIndex !== null) {
                if (editFile) {
                    if (data.file && typeof data.file === 'string' && data.file.startsWith('uploads/')) {
                        formData.append('file', file[0]);
                    }
                }
                const payload = formData;
                await updateTask(payload, data.id);
                await getTask();
                setEditingIndex(null);
            } else {
                if (file && file.length > 0) {
                    formData.append('file', file[0]);
                }
                const payload = formData;
                await createTask(payload);
                await getTask();
            }
            setIsSubmitting(false);
            setFile(null);
            setPreviewFile(null);
            reset();
        } catch (error) {
            setIsSubmitting(false)
            console.log('Error thrown during task ', error);
        }
    };

    const handleEdit = (task) => {
        Object.entries(task).forEach(([key, value]) => {
            if (key === 'dueDate' && value) {
                const dateOnly = new Date(value).toISOString().split('T')[0];
                setValue(key, dateOnly);
            } else {
                setValue(key, value);
            }
        });
        setPreviewFile(task?.file);
        setEditingIndex(task.id);
    };

    const handleDelete = async (id) => {
        await deleteTask(id);
        await getTask();
    };

    return (
        <div className="mx-auto p-8 bg-gradient-to-br from-indigo-50 to-pink-100 min-h-screen rounded-2xl shadow-lg">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold text-fuchsia-700 tracking-tight">Task Dashboard</h1>
                <button
                    onClick={() => {
                        reset();
                        setFile(null);
                        setEditingIndex(null);
                        setPreviewFile(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-2.5 text-white font-semibold shadow hover:from-fuchsia-600 hover:to-pink-600 transition"
                >
                    <Plus size={20} /> Add Task
                </button>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="mb-10 rounded-2xl bg-white p-8 shadow-xl space-y-6 border border-pink-100">
                <div>
                    <label className="block text-base font-semibold mb-2 text-fuchsia-700">Title</label>
                    <input
                        {...register('title')}
                        className="w-full rounded-lg border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                        placeholder="Enter task title"
                    />
                    <p className="text-pink-500 text-sm mt-1">{errors.title?.message}</p>
                </div>

                <div>
                    <label className="block text-base font-semibold mb-2 text-fuchsia-700">Description</label>
                    <textarea
                        {...register('description')}
                        className="w-full rounded-lg border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                        placeholder="Enter task description"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-base font-semibold mb-2 text-fuchsia-700">Status</label>
                        <select
                            {...register('status')}
                            className="w-full rounded-lg border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-base font-semibold mb-2 text-fuchsia-700">Due Date</label>
                        <input
                            type="date"
                            {...register('dueDate')}
                            className="w-full rounded-lg border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-base font-semibold mb-2 text-fuchsia-700">File</label>
                    {editingIndex === null ? (
                        <PreviewImage />
                    ) : (
                        <div className="flex items-center gap-4">
                            {previewFile && (
                                <label className="cursor-pointer flex items-center gap-2">
                                    <img
                                        src={
                                            previewFile.startsWith('data:')
                                                ? previewFile
                                                : backendUrl && `${backendUrl.replace(/\/$/, '')}/${previewFile.replace(/^\//, '')}`
                                        }
                                        alt="Task Attachment"
                                        className="h-24 rounded border border-pink-200"
                                    />
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            setEditFile(true);
                                            setFile(e.target.files);
                                            if (e.target.files && e.target.files[0]) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => setPreviewFile(ev.target.result);
                                                reader.readAsDataURL(e.target.files[0]);
                                            } else {
                                                setPreviewFile(task.find((t) => t.id === editingIndex)?.file || null);
                                            }
                                        }}
                                    />
                                </label>
                            )}
                            {!previewFile && <PreviewImage />}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-fuchsia-600 hover:to-pink-600 transition shadow"
                        disabled={isSubmitting}
                    >
                        {editingIndex !== null ? 'Update Task' : 'Create Task'}
                    </button>
                    <button
                        onClick={downloadTask}
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-6 py-2 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-500 transition shadow"
                    >
                        ⬇️ Download CSV Report
                    </button>
                </div>
            </form>

            <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-pink-200 bg-white">
                <table className="min-w-full divide-y divide-pink-100 text-base">
                    <thead className="bg-pink-50 text-fuchsia-700 font-bold">
                        <tr>
                            <th className="px-5 py-4">Title</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Due Date</th>
                            <th className="px-5 py-4 w-36 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-50">
                        {task && task.length > 0 ? (
                            task.map((t) => (
                                <tr key={t.id} className="hover:bg-pink-50 transition">
                                    <td className="px-5 py-4 whitespace-nowrap">{t.title}</td>
                                    <td className="px-5 py-4 capitalize">{t.status}</td>
                                    <td className="px-5 py-4">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                title="Edit"
                                                onClick={() => handleEdit(t)}
                                                className="rounded-lg p-2 text-fuchsia-600 hover:bg-pink-100 transition"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                title="Delete"
                                                onClick={() => handleDelete(t.id)}
                                                className="rounded-lg p-2 text-rose-600 hover:bg-rose-100 transition"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>))
                             ) : (
                            <tr>
                                <td colSpan="4" className="px-5 py-8 text-center text-medium text-gray-500">
                                    No tasks found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
