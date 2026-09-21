import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_AUTH_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('expense_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('expense_token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('expense_token', token);
    } else {
      localStorage.removeItem('expense_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('expense_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('expense_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_AUTH_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_AUTH_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      // If token is returned, log in immediately
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
      }

      return { success: true, message: data.message, user: data.user };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_AUTH_URL}/logout`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }).catch(() => {});
      }
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('expense_token');
      localStorage.removeItem('expense_user');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
