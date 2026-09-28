import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const storedToken = localStorage.getItem('token');
      // If no token exists, the user is definitely not logged in; don't trigger 401s
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('/api/auth/profile');
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
      } catch (error) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, fitnessLevel) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password, fitnessLevel });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
