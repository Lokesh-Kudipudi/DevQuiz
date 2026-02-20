import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5174',
    withCredentials: true
});

instance.interceptors.request.use((config) => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (apiKey) {
        config.headers['x-gemini-api-key'] = apiKey;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5174';

export default instance;
