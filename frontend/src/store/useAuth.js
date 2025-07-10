import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../constant';

export const useAuth = create((set) => ({
    user: null,
    profile: null,
    isAuthenticated: null,
    isLoading: false,
    isChecking: true,

    signup: async (payload) => {
        set({ isLoading: true, error: null });

        try {
            const signUpResponse = await axios.post(`${API_URL}/auth/register`, payload);
            set({ user: signUpResponse.data.user, isAuthenticated: true, isLoading: false });
            toast.success('Signup successful! 🎉 Welcome aboard!');
            return true;
        } catch (error) {
            set({ error: error.response.data.message || 'Error Signing up', isLoading: false });
            toast.error(error.response.data.message || 'Error Signing up');
            return false;
        }
    },

    login: async (payload) => {
        set({ isLoading: true, error: null });

        try {
            const loginResponse = await axios.post(`${API_URL}/auth/login`, payload);
            localStorage.setItem('token', loginResponse.data.token);
            set({ user: loginResponse.data.user, isAuthenticated: true, isLoading: false });
            toast.success('Logged in successfully! 🎉 Welcome aboard!');
        } catch (error) {
            set({ error: error.response.data.message || 'Error Logging in', isLoading: false });
            toast.error(error.response.data.message || 'Error Logging in');
        }
    },

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            set({ profile: res.data, isLoading: false, error: null });
        } catch (err) {
            set({ profile: null, isLoading: false, error: err.message });
        }
    },

    updateProfile: async (file, profileId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.put(`${API_URL}/auth/profile/${profileId}`, file, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            set({ profile: res.data, isLoading: false, error: null });
        } catch (error) {
            set({ error: error.response.data.message || 'Error Updating Profile', isLoading: false });
        }
    },
}));
