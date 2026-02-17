import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5174',
    withCredentials: true
});

export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5174';

export default instance;
