import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const useAuth = () => useContext(AuthContext);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Store user role
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const expiresIn = 60; // Token expiry time in minutes

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/auth/currentUser', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCurrentUser(data);
        console.log("Fetched current user:", data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem('token')) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);
  
  

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });


      const { token, role, user } = response.data;
      const { data } = await axios.get('http://localhost:3001/api/auth/currentUser', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setCurrentUser(data);
      console.log("get auth user ", data) 
  
      const now = new Date();
      const expiryTime = now.getTime() + expiresIn * 60 * 1000; // Convert minutes to milliseconds
      // const tokenData = JSON.stringify({ token, expiryTime });
      const tokenData = token;
  
      localStorage.setItem('token', tokenData); // Save as JSON string
      localStorage.setItem('role', role); // Role can be saved as a string
      localStorage.setItem('user', JSON.stringify(user)); // Ensure user is stringified
  
      setUser(token);
      setRole(role);
      setUserInfo(user);
  
      console.log('Logged in successfully:', { token, role, user });
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid email or password');
    }
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setUser(null);
    setRole(null);
    setUserInfo([]);
    setCurrentUser(null);
    console.log('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        error,
        userInfo,
        currentUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
