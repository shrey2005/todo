import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Edit, Trash, Plus } from 'lucide-react';
import { useTask } from '../store/useTask';

const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string(),
    status: yup.string().required(),
    dueDate: yup.date().nullable(),
    file: yup.mixed(),
});

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function TaskDashboard() {
    const { isLoading, isChecking, createTask, getTask, deleteTask, updateTask, task, downloadTask } = useTask();

    useEffect(() => {
        getTask();
    }, []);

    const [editingIndex, setEditingIndex] = useState(null);
    const [file, setFile] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [editFile, setEditFile] = useState(false);

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
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (file && file.length > 0) {
                formData.append('file', file[0]);
            }
            if (editingIndex !== null) {
                if (editFile) {
                    if (data.file && typeof data.file === 'string' && data.file.startsWith('uploads/')) {
                        formData.delete('file');
                    }
                }
                const payload = formData;
                await updateTask(payload, data.id);
                await getTask();
                setEditingIndex(null);
            } else {
                const payload = formData;
                await createTask(payload);
                await getTask();
            }
            setFile(null);
            setPreviewFile(null);
            reset();
        } catch (error) {
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
        <div className="max-w-5xl mx-auto p-6">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Task Dashboard</h1>
                <button
                    onClick={() => {
                        reset();
                        setFile(null);
                        setEditingIndex(null);
                        setPreviewFile(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
                >
                    <Plus size={18} /> Add Task
                </button>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="mb-8 rounded-xl bg-white p-6 shadow space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input {...register('title')} className="w-full rounded-lg border px-3 py-2" />
                    <p className="text-red-500 text-sm">{errors.title?.message}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea {...register('description')} className="w-full rounded-lg border px-3 py-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select {...register('status')} className="w-full rounded-lg border px-3 py-2">
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Due Date</label>
                        <input type="date" {...register('dueDate')} className="w-full rounded-lg border px-3 py-2" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">File</label>
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
                                        className="h-24 rounded border"
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

                <div className="text-right">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        {editingIndex !== null ? 'Update Task' : 'Create Task'}
                    </button>
                    <button
                        onClick={downloadTask}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        ⬇️ Download CSV Report
                    </button>
                </div>
            </form>

            <div className="overflow-x-auto rounded-xl shadow-sm ring-1 ring-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-left font-semibold">
                        <tr>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Due Date</th>
                            <th className="px-4 py-3 w-32 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {task &&
                            task.length > 0 &&
                            task.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">{t.title}</td>
                                    <td className="px-4 py-3 capitalize">{t.status}</td>
                                    <td className="px-4 py-3">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                title="Edit"
                                                onClick={() => handleEdit(t)}
                                                className="rounded p-2 text-blue-600 hover:bg-blue-50"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                title="Delete"
                                                onClick={() => handleDelete(t.id)}
                                                className="rounded p-2 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
