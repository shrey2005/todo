import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../constant';

export const useAuth = create((set) => ({
    user: null,
    profile: null,
    isAuthenticated: null,
    error: null,
    isLoading: false,
    isChecking: true,

    signup: async (payload) => {
        set({ isLoading: true, error: null });

        try {
            const signUpResponse = await axios.post(`${API_URL}/auth/register`, payload);
            set({ user: signUpResponse.data.user, isAuthenticated: true, isLoading: false, error: null });
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
            const loginResponse = await axios.post(`${API_URL}/auth/login`, payload, { withCredentials: true });
            set({ user: loginResponse?.data?.user, isAuthenticated: true, isLoading: false, error: false });
            // toast.success('Logged in successfully! 🎉 Welcome aboard!');
        } catch (error) {
            console.error('Login error:', error?.response?.data?.error || error);
            set({ error: error?.response?.data?.error || 'Error Logging in', isLoading: false });
            toast.error(error?.response?.data?.error || error?.response?.error, 'Error Logging in');
        }
    },

    logout: async () => {
        set({ user: null, isAuthenticated: false, profile: null });
        try {
            const logoutResponse = await axios.post(`${API_URL}/auth/logout`, {}, {
                withCredentials: true,
            });
            localStorage.removeItem('token');
            toast.success('Logged out successfully! 👋 See you soon!');
        } catch (error) {
            set({ error: error.response.data.message || 'Error Logging out' });
            toast.error(error.response.data.message || 'Error Logging out');
        }
    },

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/auth/profile`, {
                 withCredentials: true,
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
                withCredentials: true,
            });
            set({ profile: res.data, isLoading: false, error: null });
            toast.success(res?.data?.message || 'Profile updated successfully!');
        } catch (error) {
            set({ error: error.response.data.message || 'Error Updating Profile', isLoading: false });
        }
    },
}));
