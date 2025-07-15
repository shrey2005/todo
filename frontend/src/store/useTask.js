import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../constant';

export const useTask = create((set) => ({
    task: null,
    isLoading: false,
    isChecking: true,

    createTask: async (payload) => {
        set({ isLoading: true, error: null });

        try {
            const todoResponse = await axios.post(`${API_URL}/task/createtasks`, payload, {
                withCredentials: true
            });
            set({ task: todoResponse.data.user, isAuthenticated: true, isLoading: false });
            toast.success('Todo created successfully! 🎉 Welcome aboard!');
            return true;
        } catch (error) {
            set({ error: error.response.data.message || 'Error Todo creation', isLoading: false });
            toast.error(error.response.data.message || 'Error Todo creation');
            return false;
        }
    },

    getTask: async () => {
        set({ isLoading: true, error: null });
        try {
            const todoResponse = await axios.get(`${API_URL}/task/gettasks`, { withCredentials: true });
            set({ task: todoResponse.data });
            return true;
        } catch (error) {
            set({ error: error.response.data.message || 'Error Todo Fetch', isLoading: false });
            toast.error(error.response.data.message || 'Error Todo Fetch');
            return false;
        }
    },

    deleteTask: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const todoResponse = await axios.delete(`${API_URL}/task/deletetasks/${id}`, {
                withCredentials: true,
            });
            set({ task: todoResponse.data });
            toast.success('Todo deleted successfully!');    
            return true;
        } catch (error) {
            set({ error: error.response.data.message || 'Error Todo Deletion', isLoading: false });
            toast.error(error.response.data.message || 'Error Todo Deletion');
            return false;
        }
    },

    updateTask: async (payload, id) => {
        set({ isLoading: true, error: null });
        try {
            const todoResponse = await axios.put(`${API_URL}/task/updatetasks/${id}`, payload, {
                withCredentials: true,
            });
            set({ task: todoResponse.data });
            return true;
        } catch (error) {
            set({ error: error.response.data.message || 'Error Todo Deletion', isLoading: false });
            toast.error(error.response.data.message || 'Error Todo Deletion');
            return false;
        }
    },

    downloadTask: async () => {
        try {
            const response = await axios.get(`${API_URL}/task/downloadtask`, {
                withCredentials: true,
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'tasks.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading task:', error);
            toast.error(error.response.data.message || 'Error downloading task');
        }
    }
}));
