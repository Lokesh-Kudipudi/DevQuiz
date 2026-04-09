import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { baseURL } from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await axios.get('/auth/me');
                setUser(data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);
    
    const login = () => {
        window.location.href = `${baseURL}/auth/google`;
    };

    const loginWithEmail = async (email, password) => {
        try {
            const { data } = await axios.post('/auth/login', { email, password });
            setUser(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const registerWithEmail = async (name, email, password) => {
        try {
            const { data } = await axios.post('/auth/register', { name, email, password });
            setUser(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.get('/auth/logout');
            setUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, loginWithEmail, registerWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
